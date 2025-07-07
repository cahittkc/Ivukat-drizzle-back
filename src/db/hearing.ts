import { pgTable, uuid, varchar, serial, timestamp, bigint } from "drizzle-orm/pg-core";
import { users } from "./user";




export const hearing = pgTable('hearings',
    {
        id : serial('id').primaryKey(),
        userId : uuid('user_id').notNull().references(() => users.id),
        esasNo : varchar('esas_no'),
        hearingId : bigint('hearing_id', { mode: 'number' }).notNull().unique(),
        courtId : varchar('court_id'),
        judgmentUnitUyapId : varchar('judgment_unit_uyap_id'),
        caseTypeDescription : varchar('case_type_description'),
        courtNameDescription : varchar('court_name_description').notNull(),
        hearingDate : timestamp("hearing_date", { withTimezone: true }).notNull(),
        hearingDescription : varchar('hearing_description').notNull(),
        hearingResultDescription : varchar('hearing_result_description').notNull(),

    }
)


// {
//     "kayitId": 14718184072,
//     "dosyaId": "R8RiJbVjKL9NlxUYoPiQ8+JYK1skgQNCGgplmvZF+8Kz@DKaG0g2jXctZswKxMRQ",
//     "dosyaNo": "2020/110",
//     "dosyaTurKod": 15,
//     "dosyaTurKodAciklama": "Hukuk Dava Dosyası",
//     "birimId": "1004923",
//     "birimOrgKodu": "1.04.071.000.0204",
//     "birimTuru1": "09",
//     "birimTuru2": "0920" == judgmentUnitUyapId : varchar('judgment_unit_uyap_id')
//     "birimTuru3": "0992",
//     "yerelBirimAd": "İzmir 4. Asliye Hukuk Mahkemesi",
//     "tarihSaat": "2025-06-12 09:10:00.0",
//     "islemTuru": 0,
//     "islemSonucu": 1,
//     "hakimHeyet": 0,
//     "islemTuruAciklama": "Duruşma",
//     "islemSonucuAciklama": "Duruşma Yapıldı",
//     "dosyaTaraflari": [
//         {
//             "isim": "AHMET",
//             "soyad": "ŞEKER",
//             "sifat": "DAVACI"
//         },
//         {
//             "isim": "AZİME",
//             "soyad": "ÇAMCI",
//             "sifat": "İLGİLİ"
//         },
//         {
//             "isim": "AZİZ",
//             "soyad": "ÇELİK",
//             "sifat": "DAVACI"
//         },
//         {
//             "isim": "EMİNE",
//             "soyad": "MALKOÇ",
//             "sifat": "DAVACI"
//         },
//         {
//             "isim": "KONAK BELEDİYE BAŞKANLIĞI",
//             "sifat": "DAVALI"
//         },
//         {
//             "isim": "İZMİR BÜYÜKŞEHİR BELEDİYE BAŞKANLIĞI",
//             "sifat": "DAVALI"
//         }
//     ],
//     "izinliHakimList": [],
//     "talepDurumu": "Diğer",
    
// }