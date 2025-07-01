import { db } from "../db";
import { ClientRepository } from "../repositories/clientsRepository";


export class ClientService {
    private clientRepository : ClientRepository

    constructor(){
        this.clientRepository = new ClientRepository(db)
    }


    async getClientsPaginatedByUserId(data : any) {
        return await this.clientRepository.getClientsByUserIdPaginated(data);
    }
}