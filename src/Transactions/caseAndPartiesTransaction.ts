import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {db} from "../db/index"
import { users, case_example,parties_example } from "../db/schema";
import { eq } from "drizzle-orm";

export async function addCaseWithParties(data: any) {
  return await db.transaction(async (trx) => {
    // 1. Kullanıcıyı kontrol et
    const user = await trx.select().from(users).where(eq(users.id, data.userId)).limit(1);
    if (!user[0]) {
      throw new Error("User not found");
    }

    // 2. Tarihi güvenli şekilde parse et
    const parsedDate = dayjs(data.tarih, "DD.MM.YYYY HH:mm");
    if (!parsedDate.isValid()) {
      throw new Error("Invalid date format");
    }

    // 3. Case ekle
    const [newCase] = await trx.insert(case_example).values({
      userId: data.userId,
      court: data.mahkeme,
      esasNo: data["esas-no"],
      description: data.durum,
      date: parsedDate.toDate(),
    }).returning();

    // 4. Parties'i toplu ekle
    const partiesToInsert = data.parties.map((party: any) => ({
      caseId: newCase.id,
      esasNo: data["esas-no"],
      rol: party["Rol"],
      type: party["Tipi"],
      fullName: party["Adı"],
      deputy: party["Vekil"],
    }));

    await trx.insert(parties_example).values(partiesToInsert);

    return { case: newCase };
  });
}