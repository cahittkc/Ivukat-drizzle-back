import { eq, InferSelectModel, InferInsertModel, inArray,sql , or, and} from "drizzle-orm";
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

    async searchCaseByEsasNoOrCourtLike(data:any) {
        if (!data.searchText) {
            throw new Error('Search text not found');
        }
        // Arama stringini normalize et
        const normalizedSearch = this.normalizeStr(data.searchText.replace(/\s/g, ''));
        const likePattern = `%${normalizedSearch}%`;

        console.log("====>>>>",data);

        // Normalized alanlar üzerinden arama yap
        const result = await this.db
            .select()
            .from(case_example)
            .where(
                and(
                    eq(case_example.userId, data.userId),
                    or(
                        sql`${case_example.normalizedEsasno} LIKE ${likePattern}`,
                        sql`${case_example.normalizedCourt} LIKE ${likePattern}`
                    )
                )
            );
            
        return result;
    }

    private normalizeStr(str: string): string {
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
}