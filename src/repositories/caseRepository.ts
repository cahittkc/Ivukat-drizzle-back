import { eq, InferSelectModel, InferInsertModel } from "drizzle-orm";
import {case_example} from "../db/caseExample"
import { parties_example } from "../db/partiesExample";


type CaseExample = InferSelectModel<typeof case_example>
type PartiesExample = InferSelectModel<typeof parties_example>



export class CaseRepository {
    private db;
    
    constructor(dbInstance: any) {
        this.db = dbInstance;
    }
    
  
    
    async getCaseWithPartiesById(esasNo: string): Promise<any> {
        // 1. Önce case'i bul
        const [caseData] = await this.db
            .select()
            .from(case_example)
            .where(eq(case_example.esasNo, esasNo))
            .limit(1);
        
        if (!caseData) {
            throw new Error("Case not found");
        }
        
        // 2. Sonra parties'leri bul
        const parties = await this.db
            .select({
                esasNo :parties_example.esasNo,
                rol : parties_example.rol,
                type : parties_example.type,
                fullName : parties_example.fullName,
                deputy : parties_example.deputy
            })
            .from(parties_example)
            .where(eq(parties_example.esasNo, esasNo));
        
        return {
            case : {
                ...caseData,
                parties
            }
        };
    }
}