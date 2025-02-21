import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import {
  rekognitionClient,
  s3Client,
} from "../../infrastructure/configs/aswS3";
import {
  ContentModerationDetection,
  DetectModerationLabelsCommand,
  GetContentModerationCommand,
  ModerationLabel,
  StartContentModerationCommand,
} from "@aws-sdk/client-rekognition";

export default class AwsS3Storage {
  public async uploadFile(
    file: Express.Multer.File,
    uploadPath: string
  ): Promise<string> {
    const uniqueName = `${uuidv4()}-${Date.now()}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uploadPath}/${uniqueName}`,
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

  public async checkImageModeration(
    key: string
  ): Promise<{ isInappropriate: boolean; labels: ModerationLabel[] }> {
    const fileKey = key.split(".com/")[1];
    const params = {
      Image: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Name: fileKey,
        },
      },
    };
    try {
      const command = new DetectModerationLabelsCommand(params);
      const response = await rekognitionClient.send(command);
      const moderationLabels = response.ModerationLabels || [];

      return {
        isInappropriate: moderationLabels.length > 0,
        labels: moderationLabels,
      };
    } catch (error) {
      console.error("Error detecting moderation labels", error);
      throw new Error("Failed to check image moderation");
    }
  }

  public async checkVideoModeration(key: string): Promise<string | undefined> {
    const fileKey = key.split(".com/")[1];
    const params = {
      Video: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Name: fileKey,
        },
      },
    };
    try {
      const command = new StartContentModerationCommand(params);
      const response = await rekognitionClient.send(command);

      return response.JobId;
    } catch (error) {
      console.error("Error starting video moderation", error);
      throw new Error("Failed to check video moderation");
    }
  }

  public async getVideoModerationResults(jobId: string): Promise<{
    isInappropriate: boolean;
    labels: ContentModerationDetection[];
  }> {
    const params = {
      JobId: jobId,
    };

    try {
      let jobStatus = "IN_PROGRESS";
      let moderationLabels: ContentModerationDetection[] = [];

      while (jobStatus === "IN_PROGRESS") {
        const command = new GetContentModerationCommand(params);
        const response = await rekognitionClient.send(command);

        jobStatus = response.JobStatus || "FAILED";

        if (jobStatus === "SUCCEEDED") {
          moderationLabels = response.ModerationLabels || [];
          break;
        } else if (jobStatus === "FAILED") {
          throw new Error("Video moderation job failed");
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      return {
        isInappropriate: moderationLabels.length > 0,
        labels: moderationLabels,
      };
    } catch (error) {
      console.error("Error getting video moderation results", error);
      throw new Error("Failed to retrieve video moderation results");
    }
  }
}
