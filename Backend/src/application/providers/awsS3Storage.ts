import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../../infrastructure/configs/aswS3";

export default class AwsS3Storage {
  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/profiles/${uniqueName}`,
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

  public async uploadFileOfMusicImage(file: Express.Multer.File): Promise<string> {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/music-image/${uniqueName}`,
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

  public async uploadFileOfMusic(
    imageFile: Express.Multer.File,
    audioFile: Express.Multer.File
  ): Promise<{ imageFileUrl: string; audioFileUrl: string }> {
    const imageUniqueName = `${uuidv4()}-${imageFile.originalname}`;
    const audioUniqueName = `${uuidv4()}-${audioFile.originalname}`;
    const imageParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/music-image/${imageUniqueName}`,
      Body: imageFile.buffer,
      ContentType: imageFile.mimetype,
    };
    const audioParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/music/${audioUniqueName}`,
      Body: audioFile.buffer,
      ContentType: audioFile.mimetype,
    };
    try {
      const iamgeCommand = new PutObjectCommand(imageParams);
      await s3Client.send(iamgeCommand);
      const imageFileUrl = `https://${imageParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageParams.Key}`;

      const audioCommand = new PutObjectCommand(audioParams);
      await s3Client.send(audioCommand);
      const audioFileUrl = `https://${audioParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioParams.Key}`;
      return { imageFileUrl, audioFileUrl };
    } catch (error) {
      console.error("Error uploading image in aws s3", error);
      throw new Error("Failed to upload image in aws s3");
    }
  }
}
