import { eq, InferSelectModel, InferInsertModel, inArray,sql , or, and } from "drizzle-orm";
import {case_example} from "../db/caseExample"
import { parties_example } from "../db/partiesExample";
import { clients } from "../db/clients";
import { caseInfos } from "../db/caseInfo";


type CaseExample = InferSelectModel<typeof case_example>
type PartiesExample = InferSelectModel<typeof parties_example>



export class CaseRepository {
    private db;
    
    constructor(dbInstance: any) {
        this.db = dbInstance;
    }

    async getCaseByUserId(userId : string){
        const result = await this.db.select().from(case_example).where(eq(case_example.userId, userId));
        return result;
    }


    async getCaseInfo(caseNo : string){
        const result = await this.db.select().from(caseInfos).where(eq(caseInfos.dosyaNo, caseNo))
        return result[0];
    }


    async getCasesByUserIdWithPagination(data: {
        userId: string;
        page: number;
        pageSize: number;
        judgmentTypeId?: string;
        judmentUnitUyapId?: string;
    }) {
        const offset = (data.page - 1) * data.pageSize;
        
        // Where koşullarını array'de topla
        const whereConditions = [eq(case_example.userId, data.userId)];
        
        // Eğer judgmentTypeId varsa ekle
        if (data.judgmentTypeId) {
            whereConditions.push(eq(case_example.judgmentTypeId, data.judgmentTypeId));
        }
        
        // Eğer judmentUnitUyapId varsa ekle
        if (data.judmentUnitUyapId) {
            whereConditions.push(eq(case_example.judgmentUnitUyapId, data.judmentUnitUyapId));
        }
        
        const result = await this.db
            .select()
            .from(case_example)
            .where(and(...whereConditions))
            .limit(data.pageSize)
            .offset(offset);
        
        // Toplam kayıt sayısı için aynı koşulları kullan
        const countResult = await this.db
            .select({ count: sql`count(*)`.mapWith(Number) })
            .from(case_example)
            .where(and(...whereConditions));
        
        return {
            data: result,
            total: countResult[0].count,
            page: data.page,
            pageSize: data.pageSize
        };
    }

    async searchCaseByEsasNoOrCourtLike(searchText: string) {
        if (!searchText) {
            throw new Error('Search text not found');
        }
        // Arama stringini normalize et
        const normalizedSearch = this.normalizeTR(searchText.replace(/\s/g, ''));
        const likePattern = `%${normalizedSearch}%`;

        // SQL'de: boşlukları kaldır, küçük harfe çevir, Türkçe karakterleri normalize et
        const result = await this.db
            .select()
            .from(case_example)
            .where(
                or(
                    sql`
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(REPLACE(${case_example.esasNo}, ' ', '')), 'ı', 'i'), 'İ', 'i'), 'ü', 'u'), 'Ü', 'u'), 'ö', 'o'), 'ç', 'c'), 'ş', 's') LIKE ${likePattern}
                    `,
                    sql`
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(REPLACE(${case_example.court}, ' ', '')), 'ı', 'i'), 'İ', 'i'), 'ü', 'u'), 'Ü', 'u'), 'ö', 'o'), 'ç', 'c'), 'ş', 's') LIKE ${likePattern}
                    `
                )
            );
            
        return result;
    }

    private normalizeTR(str: string): string {
        return str
            .toLocaleLowerCase('tr-TR')
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ı/g, 'i')
            .replace(/ş/g, 's')
            .replace(/ğ/g, 'g')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ü/g, 'u')
            .replace(/Ü/g, 'u');
    }
}