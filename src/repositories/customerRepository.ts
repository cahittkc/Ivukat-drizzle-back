import { InferInsertModel, InferSelectModel } from "drizzle-orm";
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




}