
import {
    pgTable,
    serial,
    varchar,
    integer,
    boolean,
    timestamp
  } from "drizzle-orm/pg-core";
import { case_example } from "./caseExample";
import { judgment_types } from "./judgmentType";
  
  export const caseInfos = pgTable("case_infos", {
    id: serial("id").primaryKey(),
    caseNo : varchar('case_no').unique().notNull().references(() => case_example.caseNo),
  
    // Common fields
    caseJudgmentTypeId: varchar("case_judgment_type_id",).notNull().references(() => judgment_types.uyapId), // Hukuk / İcra / İdari / Satış
    fileStatus: varchar("file_status"),
    hearingDate: timestamp("hearing_date", { withTimezone: true }),
    discoveryDate: timestamp("discovery_date" , {withTimezone : true} ),
    preliminaryReviewDate: timestamp("preliminary_review_date" , {withTimezone : true}),
  
    // Civil Court (Hukuk Mahkemesi)
    filingType: varchar("filing_type"),
    submissionCount: integer("submission_count"),
    submissionDate: timestamp("submission_date", {withTimezone : true}),
    caseCategories: varchar("case_categories"),
    relatedFiles: varchar("related_files"),
    relatedCases: varchar("related_cases"),
    relatedSeriesCases: varchar("related_series_cases"),
    mergedFiles: varchar("merged_files"),
  
    // Enforcement (İcra)
    enforcementType: varchar("enforcement_type"),
    enforcementWay: varchar("enforcement_way"),
    enforcementForm: varchar("enforcement_form"),
  
    // Administrative Court (İdari Yargı)
    subFileReturnDate: timestamp("sub_file_return_date", {withTimezone : true}),
    caseSubject: varchar("case_subject"),
    caseNotes: varchar("case_notes"),
    caseSummary: varchar("case_summary"),
    arrivalReason: varchar("arrival_reason"),
    decision: varchar("decision"),
    decisionNo: varchar("decision_no"),
    decisionDate: timestamp("decision_date", {withTimezone : true}),
    defenseSummary: varchar("defense_summary"),
    injunctionGiven: boolean("injunction_given"),
    executionSuspended: boolean("execution_suspended")
  });
  