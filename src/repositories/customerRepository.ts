import { and, eq, InferInsertModel, InferSelectModel,sql } from "drizzle-orm";
import { customer } from "../db/customers";
import { NewCustomerDto } from "../DTOs/customerDtos";



export class CustomerRepository {
    private db;

    constructor(dbInstance:any){
        this.db = dbInstance
    }


    async create(values : NewCustomerDto ){
        const result = await this.db.insert(customer).values(values).returning();
        return result[0];
    }


    async getCustomersByUserId(data : {
        userId:string,
        customerType : string
        page: number,
        pageSize: number,

    }){
        
        const offset = (data.page - 1) * data.pageSize;
        const whereConditions = [eq(customer.userId, data.userId)];

        if(data.customerType){
            whereConditions.push(eq(customer.customerType, data.customerType as 'person' | 'company'));
        }

        const result = await this.db.select(
            {
                id : customer.id,
                firstName : customer.firstName,
                middleName : customer.middleName,
                lastName : customer.lastName,
                companyName : customer.companyName,
                customerType : customer.customerType,
                identityNumber : customer.identityNumber,
                taxNumber : customer.taxNumber, 
                createdAt : customer.createdAt,
                deletedAt : customer.deletedAt,
                updatedAt :customer.updatedAt
            }
        )
        .from(customer)
        .where(and(...whereConditions))
        .limit(data.pageSize)
        .offset(offset);
        
        return result 
    }

    // async updateCustomerCaseNumbers(data : {customerId: string, newCaseNumbers: string[]}) {
    //     const result = await this.db
    //     .select({ caseNumbers: customer.caseNumbers })
    //     .from(customer)
    //     .where(eq(customer.id, data.customerId))
    //     .limit(1)

    //     const existing = result[0]?.caseNumbers ?? []

    //     const merged = [...new Set([...existing, ...data.newCaseNumbers])]


    //     const {rowCount} = await this.db
    //     .update(customer)
    //     .set({
    //         caseNumbers: sql`ARRAY[${sql.join(merged, ',')}]::text[]`
    //     })
    //     .where(eq(customer.id, data.customerId))

    //     if (rowCount > 0) {
    //     const updated = await this.db
    //         .select(
    //             {
    //                 id : customer.id,
    //                 firstName : customer.firstName,
    //                 middleName : customer.middleName,
    //                 lastName : customer.lastName,
    //                 companyName : customer.companyName,
    //                 customerType : customer.customerType,
    //                 identityNumber : customer.identityNumber,
    //                 taxNumber : customer.taxNumber, 
    //                 caseNumbers : customer.caseNumbers,
    //                 createdAt : customer.createdAt,
    //                 deletedAt : customer.deletedAt,
    //                 updatedAt :customer.updatedAt
    //             }
    //         )
    //         .from(customer)
    //         .where(eq(customer.id, data.customerId));

    //         return updated[0]    
    //     }
    // }

}