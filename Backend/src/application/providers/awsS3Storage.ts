import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../infrastructure/configs/aswS3";

export default class AwsS3Storage {
  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const unique_id = uuidv4();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/profiles/${unique_id}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading image in aws s3", error);
      throw new Error("Failed to upload image in aws s3");
    }
  }
  public async deleteFile(key: string): Promise<string> {
    const fileKey = key.split(".com/")[1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    try {
      const headCommand = new HeadObjectCommand(params);
      await s3Client.send(headCommand);

      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      return "File deleted!";
    } catch (error) {
      if (error instanceof Error && error.name === "NotFound") {
        return `File not found: ${fileKey}`;
      } else if (error instanceof Error) {
        console.error("Error deleting file from AWS S3", error);
        throw new Error("Failed to delete file from AWS S3");
      } else {
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred while deleting the file");
      }
    }
  }
}
