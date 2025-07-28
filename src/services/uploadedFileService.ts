// services/uploadedFile.service.ts
import { db } from "../db";
import { UploadedFileRepository } from "../repositories/uploadedFileRepository";
import { CustomerRepository } from "../repositories/customerRepository"
import { ApiError } from "../utils/ApiError";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

interface UploadFileDTO {
  userId: string;
  customerId: string;
  fileName: string;
  fileUrl: string;
  description?: string;
}

const s3 = new S3Client({ region: process.env.AWS_REGION });

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

  async generatePresignedUrl(data : any) {

    const customer = this.customerRepository.getCustomerById(data.customerId)
    if(!customer){
      throw ApiError.badRequest('Customer not found')
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: data.key,
    });
  
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 dakika geçerli
    return url;
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
