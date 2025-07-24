import { CustomerRepository } from "../repositories/customerRepository";
import { UserRepository } from "../repositories/userRepository";
import { db } from "../db";
import { NewCustomerDto } from "../DTOs/customerDtos";
import { ApiError } from "../utils/ApiError";
import { customerTypeEnum } from "../db/customers";
import { UtilFunctions } from "../utils/helpers";



export const CUSTOMER_TYPES = {
    PERSON: 'person',
    COMPANY: 'company',
  } as const;


export class CustomerService {
    private customerRepository : CustomerRepository
    private userRepository : UserRepository


    constructor(){
        this.customerRepository = new CustomerRepository(db)
        this.userRepository = new UserRepository(db)
    }


    async createCustomer(data: NewCustomerDto) {
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
          throw ApiError.badRequest('User not found');
        }
      
        const { customerType, identityNumber, taxNumber } = data;
      
        if (!customerType) {
          throw ApiError.badRequest('Customer type is required.');
        }
      
        const isPerson = customerType === CUSTOMER_TYPES.PERSON;
        const isCompany = customerType === CUSTOMER_TYPES.COMPANY;
      
        if (isPerson && !identityNumber) {
          throw ApiError.badRequest('Identity number is required for person type.');
        }
      
        if (isCompany && !taxNumber) {
          throw ApiError.badRequest('Tax number is required for corporation type.');
        }

        if(isPerson){
          let normalizeName : string = ''
          let nomalizeMiddleName : string = ''
          let normalizeLastName : string = ''
          if(data.firstName){
            normalizeName = UtilFunctions.normalizeStr(data.firstName)
          }
          if(data.middleName && data.middleName != ''){
            nomalizeMiddleName = UtilFunctions.normalizeStr(data.middleName)
          }
          if(data.lastName){
            normalizeLastName = UtilFunctions.normalizeStr(data.lastName)
          }
          data = {
            ...data,
            normalizeName : `${normalizeName}${nomalizeMiddleName}${normalizeLastName}`
          }
        }

        if(isCompany && data.companyName){
          data = {
            ...data,
            normalizeCompanyName : UtilFunctions.normalizeStr(data.companyName)
          }
        }


        const result = await this.customerRepository.create(data)
        return result;
    }

    async getCustomersByUserId(data){
        const user = this.userRepository.findById(data.userId)
        if(!user){
          throw ApiError.badRequest('User not found'); 
        }

        const result = await this.customerRepository.getCustomersByUserId(data)
        return result
    }
}