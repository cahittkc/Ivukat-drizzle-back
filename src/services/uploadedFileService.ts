// services/uploadedFile.service.ts
import { db } from "../db";
import { UploadedFileRepository } from "../repositories/uploadedFileRepository";
import { CustomerRepository } from "../repositories/customerRepository"
import { ApiError } from "../utils/ApiError";

interface UploadFileDTO {
  userId: string;
  customerId: string;
  fileName: string;
  fileUrl: string;
  description?: string;
}

export class UploadedFileService {
  private repository: UploadedFileRepository;
  private customerRepository : CustomerRepository

  constructor() {
    this.repository = new UploadedFileRepository(db);
    this.customerRepository = new CustomerRepository(db)
  }

  async uploadFile(data: UploadFileDTO) {
    return await this.repository.create(data);
  }

  async listFilesByCustomer(customerId: string) {
    const customer = this.customerRepository.getCustomerById(customerId)
    if(!customer){
      throw ApiError.badRequest('Customer not found')
    }
    return await this.repository.getByCustomerId(customerId);
  }

  async listFilesByUser(userId: string) {
    return await this.repository.getByUserId(userId);
  }

  async listByUserAndCustomer(userId: string, customerId: string) {
    return await this.repository.getByUserAndCustomer(userId, customerId);
  }

  async deleteFile(fileId: string) {
    return await this.repository.deleteById(fileId);
  }
}
