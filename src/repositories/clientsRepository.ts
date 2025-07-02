import { eq, InferSelectModel } from "drizzle-orm";
import { clients } from "../db/clients";
import { sql } from "drizzle-orm";


type SelectClient  = InferSelectModel<typeof clients>



export class ClientRepository {
    private db;

    constructor(dbInstance: any){
        this.db = dbInstance
    }


    async getClientByUserId(userId : string): Promise<SelectClient>{
        const result = this.db.select().from(clients).where(eq(clients.userId, userId))
        return result;
    }

    async getClientsByUserIdPaginated(data: any) {
        const offset = (data.page - 1) * data.pageSize;
        const result = await this.db
            .select({
                fullName : clients.fullName,
                caseNo : clients.caseNo
            })
            .from(clients)
            .where(eq(clients.userId, data.userId))
            .limit(data.pageSize)
            .offset(offset);

        // Toplam kayıt sayısı (opsiyonel, frontend için faydalı)
        const countResult = await this.db.select({ count: sql`count(*)`.mapWith(Number) }).from(clients);

        console.log("countResult",countResult);
        

        return {
            data: result,
            total : countResult[0].count,
            page : data.page,
            pageSize : data.pageSize
        };
    }
}