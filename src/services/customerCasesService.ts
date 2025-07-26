import { CustomerCasesRepository } from "../repositories/customerCasesRepository";
import {db} from "../db"
import { CustomerRepository } from "../repositories/customerRepository";
import { ApiError } from "../utils/ApiError";



export class CustomerCasesService{
    private customerRepository : CustomerRepository
    private customerCasesRepository : CustomerCasesRepository

    constructor() {
        this.customerCasesRepository = new CustomerCasesRepository(db)
        this.customerRepository = new CustomerRepository(db)
    }


    async createCustomerCases(data : {customerId : string, caseNos : Array<string>}){
        const customerCases = data.caseNos.map(e => {
            return {
                customerId : data.customerId,
                caseNo : e
            }
        })

        const result = await this.customerCasesRepository.createCustomerCase(customerCases)

        return result;
    }


    async getCustomerCases(customerId : string){
        const customer = await this.customerRepository.getCustomerById(customerId)
        if(!customer){
            throw ApiError.badRequest('Customer not found')
        }

        const result = await this.customerCasesRepository.getCustomerCases(customerId)

        return result;
    }
}