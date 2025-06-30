import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {db} from "../db/index"
import { users, case_example,parties_example, judgment_types, judgment_units, clients, caseInfos } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";




export async function addCaseWithParties(data: any) {
  return await db.transaction(async (trx) => {
    // 1. Kullanıcıyı kontrol et
    const user = await trx.select().from(users).where(eq(users.id, data.userId)).limit(1);
    if (!user[0]) {
      throw new Error("User not found");
    }


    const caseExist = await trx.select().from(case_example).where(eq(case_example.esasNo, data['esas-no']))

    if(caseExist[0]){
       throw new Error('This case already exist.')
    }




    let fullName = [user[0].firstName, user[0].middleName, user[0].lastName]
      .filter(Boolean)
      .join(' ')
      .trim()
      .toLocaleLowerCase();

    console.log("fullname", fullName);
    

    // 2. Tarihi güvenli şekilde parse et
    const parsedDate = dayjs(data.tarih, "DD.MM.YYYY HH:mm");
    if (!parsedDate.isValid()) {
      throw new Error("Invalid date format");
    }

    let judgmetUnitArr = await trx.select().from(judgment_units).where(eq(judgment_units.uyapId, data['birimTuru2']));
    const judgmetUnit = judgmetUnitArr[0];

    if (!judgmetUnit) {
      throw new Error('Birim id bulunamadı');
    }

    // 3. Case ekle
    const [newCase] = await trx.insert(case_example).values({
      userId: data.userId,
      court: data.mahkeme,
      esasNo: data["esas-no"],
      description: data.durum,
      date: parsedDate.toDate(),
      courtId : data["birimId"],
      oldEsasNo : data["oldEsasNos"],
      caseNo : `${data['birimId']}_${data['esas-no']}`,
      caseStatusCode : data['dosyaDurumKod'],
      caseTypeCode : data['dosyaTurKod'],
      judgmentUnitUyapId : data['birimTuru2'],
      judgmentTypeId : judgmetUnit.judgmentTypeUyapId
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

    for (const party of data.parties) {
      if (!party["Vekil"] || party["Vekil"] === "-") continue;

      const vekilList = party["Vekil"].split(",").map((v: string) => v.trim());

      for (const vekil of vekilList) {
        console.log("vekil", vekil.toLowerCase());
        
        if (normalizeTR(vekil) === normalizeTR(fullName)) {
          console.log("geldi ==>>>>");
          
          await trx.insert(clients).values({
            id: crypto.randomUUID(),
            fullName: party["Adı"],
            caseNo: data['dosyaId'],
            userId : user[0].id
          });
        }
      }
    }

    if(data.caseInfos){
      let infos = data.caseInfos

      await trx.insert(caseInfos).values({
        caseNo : data.dosyaId,
        caseJudgmentTypeId : judgmetUnit.judgmentTypeUyapId,
        filingType: infos["Dava Açılış Türü"] || null,
        submissionCount: infos["Başvuruya Bırakılma Sayısı"] ? Number(infos["Başvuruya Bırakılma Sayısı"]) : null,
        submissionDate: infos["Başvuruya Bırakılma Tarihi"] && infos["Başvuruya Bırakılma Tarihi"] !== "-" ? dayjs(infos["Başvuruya Bırakılma Tarihi"], "DD/MM/YYYY").toDate() : null,
        caseCategories: infos["Dava Türleri"] || null,
        relatedFiles: infos["İlgili Dosyalar"] || null,
        relatedCases: infos["İlgili Davalar"] || null,
        relatedSeriesCases: infos["İlgili Seri Davalar"] || null,
        mergedFiles: infos["Birleşen Dosyalar"] || null,
        fileStatus: infos["Dosya Durumu"] || null,
        hearingDate: infos["Duruşma Tarihi"] ? dayjs(infos["Duruşma Tarihi"], "DD/MM/YYYY HH:mm").toDate() : null,
        discoveryDate: infos["Keşif Tarihi"] ? dayjs(infos["Keşif Tarihi"], "DD/MM/YYYY HH:mm").toDate() : null,
        preliminaryReviewDate: infos["Ön İnceleme Tarihi"] ? dayjs(infos["Ön İnceleme Tarihi"], "DD/MM/YYYY").toDate() : null,
        injunctionGiven: infos["YD Yapıldı"] === "Evet",
        arrivalReason: infos["Geliş Nedeni"] || null,
        defenseSummary: infos["Savunmanın Özeti"] || null,
        caseNotes: infos["Davanın Notları"] || null,
        subFileReturnDate: infos["Alt Dosya İade Tarihi"] ? dayjs(infos["Alt Dosya İade Tarihi"], "DD/MM/YYYY").toDate() : null,
        decisionNo: infos["Karar No"] || null,
        executionSuspended: infos["Yürütme Durdurmalı"] === "Evet",
        caseSummary: infos["Davanın Özeti"] || null,
        caseSubject: infos["Davanın Konusu"] || null,
        decision: infos["Karar"] || null,
        decisionDate: infos["Karar Tarihi"] ? dayjs(infos["Karar Tarihi"], "DD/MM/YYYY HH:mm").toDate() : null,
      })
    }

    await trx.insert(parties_example).values(partiesToInsert);

    return { case: newCase };
  });
}

function normalizeTR(str: string) {
  return str
    .toLocaleLowerCase('tr-TR') // Türkçe küçük harfe çevir
    .normalize('NFKD')          // Unicode normalize
    .replace(/[\u0300-\u036f]/g, '') // Kombine karakterleri sil
    .replace(/ı/g, 'i')         // Türkçe "ı" harfini "i" yap
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}