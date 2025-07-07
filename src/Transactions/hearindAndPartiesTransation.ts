import { hearing } from "../db/hearing";
import {db} from "../db/index"
import { users } from "../db/user";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hearing_parties } from "../db/hearingParties";
dayjs.extend(customParseFormat);




export async function hearingAndPartiesAdd(data:any) {
    console.log("===>>>",data);
    
    return await db.transaction(async (trx) => {
        // Kullanıcı kontrolü
        
        const user = await trx.select().from(users).where(eq(users.id, data.userId)).limit(1);
        if (!user[0]) {
            throw new Error("User not found");
        }

        const hearings = data.hearings; // hearings array'i

        // Her hearing için işlem yap
        for (const hearingItem of hearings) {
            // Hearing'in daha önce eklenip eklenmediğini kontrol et
            const existingHearing = await trx
                .select()
                .from(hearing)
                .where(eq(hearing.hearingId, hearingItem.hearingId))
                .limit(1);

            // Eğer hearing zaten varsa, bu hearing'i atla
            if (existingHearing.length > 0) {
                console.log(`Hearing ${hearingItem.hearingId} already exists, skipping...`);
                continue;
            }

            // Hearing tarihini parse et
            const parsedDate = dayjs(hearingItem.hearingDate, "YYYY-MM-DD HH:mm:ss.S");
            if (!parsedDate.isValid()) {
                throw new Error(`Invalid date format for hearing ${hearingItem.hearingId}: ${hearingItem.hearingDate}`);
            }

            // Hearing'i ekle
            await trx.insert(hearing).values({
                userId: data.userId,
                esasNo: hearingItem.esasNo,
                hearingId: hearingItem.hearingId,
                courtId: hearingItem.courtId,
                judgmentUnitUyapId: hearingItem.judgmentUnitUyapId,
                caseTypeDescription: hearingItem.caseTypeDescription,
                courtNameDescription: hearingItem.courtNameDescription,
                hearingDate: parsedDate.toDate(),
                hearingDescription: hearingItem.hearingDescription,
                hearingResultDescription: hearingItem.hearingResultDescription
            });

            // Parties varsa ekle
            if (hearingItem.parties && hearingItem.parties.length > 0) {
                const partiesToInsert = hearingItem.parties.map((party: any) => ({
                    userId: data.userId,
                    name: party.name,
                    lastName: party.lastName || null, // lastName olmayabilir
                    hearingId: hearingItem.hearingId,
                    attribution: party.attribution
                }));

                await trx.insert(hearing_parties).values(partiesToInsert);
            }
        }
    });
}