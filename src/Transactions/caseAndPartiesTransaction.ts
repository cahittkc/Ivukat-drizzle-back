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


    const caseExist = await trx.select().from(case_example).where(eq(case_example.caseNo, data['birimId'] + '_' + data['esas-no']))

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

    // 3. Önce case'i ekle
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
      judgmentTypeId : judgmetUnit.judgmentTypeUyapId,
      normalizedEsasno : normalizeStr(data['esas-no']),
      normalizedCourt : normalizeStr(data.mahkeme),
      caseClients: [] // ilk başta boş
    }).returning();

    // 4. Sonra clients'ı ekle ve id'lerini topla
    const clientIds: string[] = [];
    for (const party of data.parties) {
      if (!party["vekil"] || party["vekil"] === "-") continue;

      const cleanVekil = party["vekil"].replace(/^\[|\]$/g, '').trim();
      const vekilList = cleanVekil.split(",").map((v: string) => v.trim());

      for (const vekil of vekilList) {
        // Vekil ismini temizle ve küçük harfe çevir
        const cleanedVekil = vekil.replace(/^\[|\]$/g, '').trim();
        console.log("vekil", cleanedVekil.toLowerCase());
        
        if (normalizeTR(cleanedVekil) === normalizeTR(fullName)) {
          console.log("geldi ==>>>>");
          const clientId = crypto.randomUUID();
          await trx.insert(clients).values({
            id: clientId,
            fullName: party["adi"],
            caseNo: newCase.caseNo, // Artık kesin var!
            userId : user[0].id
          });
          clientIds.push(clientId);
        }
      }
    }

    // 5. Son olarak caseClients alanını update et
    if (clientIds.length > 0) {
      await trx.update(case_example)
        .set({ caseClients: clientIds })
        .where(eq(case_example.id, newCase.id));
    }

    if (data.caseInfos) {
      const infos = mapCaseInfosToDbFields(data.caseInfos, `${data['birimId']}_${data['esas-no']}`);
      await trx.insert(caseInfos).values({
        ...infos,
        caseJudgmentTypeId: judgmetUnit.judgmentTypeUyapId,
      });
    }

    await trx.insert(parties_example).values(data.parties.map((party: any) => ({
      caseNo: `${data['birimId']}_${data['esas-no']}`,
      rol: party["rol"],
      type: party["kisiKurum"],
      fullName: party["adi"],
      deputy: party["vekil"] ? party["vekil"].replace(/^\[|\]$/g, '').trim() : null
    })));

    return { case: newCase };
  });
}

function normalizeTR(str: string) {
  return str
    .toLocaleLowerCase('tr-TR') // Türkçe küçük harfe çevir
    .normalize('NFKD')  
    .replace(/\s/g, '')        // Unicode normalize
    .replace(/[\u0300-\u036f]/g, '') // Kombine karakterleri sil
    .replace(/ı/g, 'i')         // Türkçe "ı" harfini "i" yap
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

function normalizeStr(str: string): string {
  return str
      .toLocaleLowerCase('tr-TR')
      .normalize('NFKD')
      .replace(/\s/g, '')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u');
}

function mapCaseInfosToDbFields(infos: any, dosya_no :string) {
  return {
    // Ortak Alanlar
    dosyaNo: dosya_no,
    caseJudgmentTypeId: infos["caseJudgmentTypeId"] || infos["case_judgment_type_id"] || null,
    dosyaDurumu: infos["dosyaDurumu"] || infos["Dosya Durumu"] || null,
    durusmaTarihi: infos["durusmaTarihiStr"]
      ? dayjs(infos["durusmaTarihiStr"], "DD/MM/YYYY HH:mm").toDate()
      : infos["durusmaTarihi"]
        ? dayjs(infos["durusmaTarihi"]).toDate()
        : null,
    kesifTarihi: infos["kesifTarihi"] ? dayjs(infos["kesifTarihi"], "DD/MM/YYYY HH:mm").toDate() : null,
    onIncelemeTarihi: infos["onIncelemeTarihi"] ? dayjs(infos["onIncelemeTarihi"], "DD/MM/YYYY").toDate() : null,

    // Hukuk Mahkemesi
    davaAcilisTuru: infos["davaAcilisTuru"] || infos["davaAcilisTuruStr"] || null,
    basvuruyaBirakilmaSayisi: infos["basvuruyaBirakilmaSayisi"] ? Number(infos["basvuruyaBirakilmaSayisi"]) : null,
    basvuruyaBirakilmaTarihi: infos["basvuruyaBirakilmaTarihiStr"] ? 
      dayjs(infos["basvuruyaBirakilmaTarihiStr"], "DD/MM/YYYY").toDate() : null,
    davaTurleri: infos["davaTurleri"] || infos["davaTurleriStr"] || null,
    ilgiliDosyalar: infos["ilgiliDosyaListesiStr"] || infos["ilgiliDosyalar"] || null,
    ilgiliDavalar: infos["ilgiliDavaListesiStr"] || infos["ilgiliDavalar"] || null,
    ilgiliSeriDavalar: infos["ilgiliSeriDavaListesiStr"] || infos["ilgiliSeriDavalar"] || null,
    birlesenDosyalar: infos["birlesenDosyaListesiStr"] || infos["birlesenDosyalar"] || null,

    // İdari Yargı
    altDosyaIadeTarihi: infos["altDosyaIadeTarihi"] ? dayjs(infos["altDosyaIadeTarihi"], "DD/MM/YYYY").toDate() : null,
    davaninKonusu: infos["davaninKonusu"] || infos["davaninkKonusu"] || infos["davaninkonusu"] || null,
    davaninNotlari: infos["davaninNotlari"] || null,
    davaninOzeti: infos["davaninOzeti"] || null,
    gelisNedeni: infos["gelisNedeni"] || infos["gelisNedeniStr"] || null,
    karar: infos["karar"] || null,
    kararNo: infos["kararNo"] || infos["karar_no"] || null,
    kararTarihi: infos["kararTarihi"] ? dayjs(infos["kararTarihi"], "DD/MM/YYYY HH:mm").toDate() : null,
    savunmaninOzeti: infos["savunmaninOzeti"] || null,
    ydYapildi: infos["ydYapildi"] === "Evet" || infos["YD Yapıldı"] === "Evet",
    yurutmeDurdurmali: infos["yurutmeDurdurmali"] === "Evet" || infos["Yürütme Durdurmalı"] === "Evet",

    // İcra Takip
    takibinTuru: infos["takibinTuru"] || null,
    takibinSekli: infos["takibinSekli"] || null,
    takibinYolu: infos["takibinYolu"] || null,
    alacakKalemToplamTutar: infos["alacakKalemToplamTutar"] ?? null,
    alacakKalemFaizTutar: infos["alacakKalemFaizTutar"] ?? null,
    takipSonrasiMasraf: infos["takipSonrasiMasraf"] ?? null,
    vekaletUcreti: infos["vekaletUcreti"] ?? null,
    tahsilHarci: infos["tahsilHarci"] ?? null,
    yapilmisBorcTahsilati: infos["yapilmisBorcTahsilati"] ?? null,
    takibinTuruAciklama: infos["takibinTuruAciklama"] || null,
    takibinSekliAciklama: infos["takibinSekliAciklama"] || null,
    takibinYoluAciklama: infos["takibinYoluAciklama"] || null,

    // Diğer Alanlar
    sonuc: infos["sonuc"] ?? false,
    isCompressed: infos["isCompressed"] ?? false,
    isMock: infos["isMock"] ?? false
  };
}