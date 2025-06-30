import {
    pgTable,
    serial,
    varchar,
    integer,
    boolean,
    timestamp,
    numeric
  } from "drizzle-orm/pg-core";
import { case_example } from "./caseExample";
import { judgment_types } from "./judgmentType";
  
  export const caseInfos = pgTable("case_infos", {
    id: serial("id").primaryKey(),
    dosyaNo: varchar('case_no').unique().notNull().references(() => case_example.caseNo),
  
    // Ortak alanlar
    caseJudgmentTypeId: varchar("case_judgment_type_id").notNull().references(() => judgment_types.uyapId),
    dosyaDurumu: varchar("file_status"),
    durusmaTarihi: timestamp("hearing_date", { withTimezone: true }),
    kesifTarihi: timestamp("discovery_date", { withTimezone: true }),
    onIncelemeTarihi: timestamp("preliminary_review_date", { withTimezone: true }),
  
    // Hukuk Mahkemesi
    davaAcilisTuru: varchar("filing_type"),
    basvuruyaBirakilmaSayisi: integer("submission_count"),
    basvuruyaBirakilmaTarihi: timestamp("submission_date", { withTimezone: true }),
    davaTurleri: varchar("case_categories"),
    ilgiliDosyalar: varchar("related_files"),
    ilgiliDavalar: varchar("related_cases"),
    ilgiliSeriDavalar: varchar("related_series_cases"),
    birlesenDosyalar: varchar("merged_files"),
  
    // İdari Yargı
    altDosyaIadeTarihi: timestamp("sub_file_return_date", { withTimezone: true }),
    davaninKonusu: varchar("case_subject"),
    davaninNotlari: varchar("case_notes"),
    davaninOzeti: varchar("case_summary"),
    gelisNedeni: varchar("arrival_reason"),
    karar: varchar("decision"),
    kararNo: varchar("decision_no"),
    kararTarihi: timestamp("decision_date", { withTimezone: true }),
    savunmaninOzeti: varchar("defense_summary"),
    ydYapildi: boolean("injunction_given"),
    yurutmeDurdurmali: boolean("execution_suspended"),
  
    // İcra Takip
    takibinTuru: varchar("takibin_turu"),
    takibinSekli: varchar("takibin_sekli"),
    takibinYolu: varchar("takibin_yolu"),
    alacakKalemToplamTutar: numeric("alacak_kalem_toplam_tutar"),
    alacakKalemFaizTutar: numeric("alacak_kalem_faiz_tutar"),
    takipSonrasiMasraf: numeric("takip_sonrasi_masraf"),
    vekaletUcreti: numeric("vekalet_ucreti"),
    tahsilHarci: numeric("tahsil_harci"),
    yapilmisBorcTahsilati: numeric("yapilmis_borc_tahsilati"),
    takibinTuruAciklama: varchar("takibin_turu_aciklama"),
    takibinSekliAciklama: varchar("takibin_sekli_aciklama"),
    takibinYoluAciklama: varchar("takibin_yolu_aciklama"),

    // Diğer Alanlar
    davaninkKonusu: varchar("davaninkonusu"),
    sonuc: boolean("sonuc"),
    isCompressed: boolean("is_compressed"),
    isMock: boolean("is_mock")
  });
  