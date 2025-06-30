import { eq, InferSelectModel, InferInsertModel, inArray } from "drizzle-orm";
import {case_example} from "../db/caseExample"
import { parties_example } from "../db/partiesExample";
import { clients } from "../db/clients";


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
}