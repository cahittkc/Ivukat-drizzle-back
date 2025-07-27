// controllers/uploadedFile.controller.ts
import { NextFunction, Request, Response, } from "express";
import { UploadedFileService } from "../services/uploadedFileService";
import { AwsS3Service } from "../services/aws3Service"
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";
//import { successReponse } from "../utils/responseHandler"


function sanitizeFileName(filename: string): string {
  return filename
    .normalize("NFD") // Unicode normalizasyonu
    .replace(/[\u0300-\u036f]/g, "") // aksanları vs. kaldır
    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // kalan özel karakterleri _ yap
}

export class UploadedFileController {
  private service: UploadedFileService;
  private s3Service : AwsS3Service

  constructor() {
    this.service = new UploadedFileService();
    this.s3Service = new AwsS3Service();

  }

  uploadAndSave = async (
    req: Request & {
      file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
      };
    },
    res: Response
  ) => {
    try {
      const file = req.file;
      const { userId, customerId, description } = req.body;
  
      if (!file || !userId || !customerId) {
        res.status(400).json({ message: "Eksik alanlar var." });
        return; // sadece akış kontrolü, tip döndürmüyorsun
      }

      const sanitizedFileName = sanitizeFileName(file.originalname);
  
      const { url } = await this.s3Service.uploadFile(
        file.buffer,
        sanitizedFileName,
        file.mimetype
      );
  
      const savedFile = await this.service.uploadFile({
        userId,
        customerId,
        fileName: sanitizedFileName,
        fileUrl: url,
        description,
      });
      res.status(201).json({success : true, message: "Dosya yüklendi", data: savedFile[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  deleteFile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteFile(id);
      res.status(200).json({ message: "Dosya silindi" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Silme hatası" });
    }
  };

  getCustomerFiles = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const { customerId } = req.body
      const result = await this.service.listFilesByCustomer(customerId)
      successResponse(res,result, '', StatusCodes.OK) 
    } catch (error) {
      next(error)
    }
  }



}
