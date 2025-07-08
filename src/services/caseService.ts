import { db } from "../db";
import { CaseRepository } from "../repositories/caseRepository";
import { UserRepository } from "../repositories/userRepository"
import { ApiError } from "../utils/ApiError";






export class CaseService{
    private caseRepository : CaseRepository
    private userRepository : UserRepository

    constructor(){
        this.caseRepository = new CaseRepository(db)
        this.userRepository = new UserRepository(db)
    }


    async getCaseByUserIdWithPaginationService(data : any){
        if(!data){
            throw ApiError.badRequest('payload not found')
        }
        const user = await this.userRepository.findById(data.userId)

        if(!user){
            throw ApiError.badRequest('User not found')
        }

        const result = await this.caseRepository.getCasesByUserIdWithPagination(data)

        return result;
    }


    async getCaseInfo(caseNo : string){
        const result = await this.caseRepository.getCaseInfo(caseNo)
        return result
    }


    async searchCaseByEsasNoOrCourtLikeService(data : {searchText : string, userId : string}){
        if(!data.searchText){
            throw  ApiError.badRequest('Search text not found')
        }

        const noSpacesText = data.searchText.replace(/\s/g, "");

        let newData = {
            searchText : noSpacesText,
            userId : data.userId
        }


        const result = await this.caseRepository.searchCaseByEsasNoOrCourtLike(newData)

        return result;

    }
}