// repositories/uploadedFile.repository.ts
import {db} from "../db"// drizzle instance
import { uploadedFiles } from "../db/uploadedFiles";
import { eq } from "drizzle-orm";


interface CreateFileDTO {
    userId: string;
    customerId: string;
    fileName: string;
    fileUrl: string;
    description?: string;
}

export class UploadedFileRepository {
    private db;

    constructor(dbInstance: any){
        this.db = dbInstance
    }


    async create(data: CreateFileDTO) {
      return await this.db.insert(uploadedFiles).values(data).returning();
    }
  
    async getByCustomerId(customerId: string) {
      const result =  await this.db.query.uploadedFiles.findMany({
        where: eq(uploadedFiles.customerId, customerId),
      });

      return result
    }
  
    async getByUserId(userId: string) {
      return await this.db.query.uploadedFiles.findMany({
        where: eq(uploadedFiles.userId, userId),
      });
    }
  
    // 🔍 Örnek ek metod: customer ve user birlikte filtrele
    async getByUserAndCustomer(userId: string, customerId: string) {
      return await this.db.query.uploadedFiles.findMany({
        where: (file, { and, eq }) =>
          and(eq(file.userId, userId), eq(file.customerId, customerId)),
      });
    }
  
    // 🗑️ Silme metodu örneği
    async deleteById(id: string) {
      return await this.db.delete(uploadedFiles).where(eq(uploadedFiles.id, id));
    }
  }
