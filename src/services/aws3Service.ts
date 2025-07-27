import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../lib/s3Client";

export class AwsS3Service {
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const bucket = process.env.S3_BUCKET_NAME!;
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3.send(command);

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { url, key };
  }
}