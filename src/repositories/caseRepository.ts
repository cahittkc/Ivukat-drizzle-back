import { eq, InferSelectModel, InferInsertModel, inArray,sql , or } from "drizzle-orm";
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


    async getCaseByUserIdWithPagination(data : any){
        const offset = (data.page - 1) * data.pageSize;
        const result = await this.db
            .select()
            .from(case_example)
            .where(eq(case_example.userId, data.userId))
            .limit(data.pageSize)
            .offset(offset);

        // Toplam kayıt sayısı (opsiyonel, frontend için faydalı)
        const countResult = await this.db.select({ count: sql`count(*)`.mapWith(Number) }).from(case_example);

        console.log("countResult",countResult);

        return {
            data: result,
            total : countResult[0].count,
            page : data.page,
            pageSize : data.pageSize
        };
    }

    async searchCaseByEsasNoOrCourtLike(searchText: string) {
        if (!searchText) {
            throw new Error('Search text not found');
        }
        // Arama stringini normalize et
        const normalizedSearch = this.normalizeTR(searchText.replace(/\s/g, ''));
        const likePattern = `%${normalizedSearch}%`;

        // SQL'de: boşlukları kaldır, küçük harfe çevir, Türkçe büyük İ'yi küçük i'ye çevir
        const result = await this.db
            .select()
            .from(case_example)
            .where(
                or(
                    sql`REPLACE(REPLACE(LOWER(REPLACE(${case_example.esasNo}, ' ', '')), 'ı', 'i'), 'İ', 'i') LIKE ${likePattern}`,
                    sql`REPLACE(REPLACE(LOWER(REPLACE(${case_example.court}, ' ', '')), 'ı', 'i'), 'İ', 'i') LIKE ${likePattern}`
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
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');
    }
}