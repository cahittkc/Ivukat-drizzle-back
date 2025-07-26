import { eq } from "drizzle-orm";
import { case_example } from "../db/caseExample";
import { customerCases } from "../db/customerCases";




export class CustomerCasesRepository {
    private db ;

    constructor(dbInstance : any){
        this.db = dbInstance
    }


    async createCustomerCase(data : any){
        const result = await this.db.insert(customerCases).values(data).onConflictDoNothing().returning();
        return result;
    }

    async getCustomerCases(customerId: string) {
        const result = await this.db
            .select({
                esasNo : case_example.esasNo,
                caseNo: case_example.caseNo,
                court: case_example.court,
                courtId : case_example.courtId,
                date : case_example.date,
                description : case_example.description,
                caseStatusCode : case_example.caseStatusCode
            })
            .from(customerCases)
            .innerJoin(case_example, eq(customerCases.caseNo, case_example.caseNo))
            .where(eq(customerCases.customerId, customerId));

        return result;
    }

}