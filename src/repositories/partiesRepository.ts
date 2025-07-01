import { eq, InferSelectModel } from "drizzle-orm";
import { parties_example } from "../db/partiesExample";



type PartiesExample = InferSelectModel<typeof parties_example>



export class PartiesRepository{
    private db;
    
    constructor(dbInstance: any){
        this.db = dbInstance
    }


    async getPartiesByCaseNo(caseNo : string) : Promise<PartiesExample> {
        //1004961_2024-7198 gelen caseNo
        const sanitizeCaseno = caseNo.replace('-', '/')
        const result = await this.db.select().from(parties_example).where(eq(parties_example.caseNo,sanitizeCaseno))
        return result;
    }
}