import { ContentModerationDetection, ModerationLabel } from "@aws-sdk/client-rekognition";

interface CustomFilter {
  label: string;
  value: number;
  field: string;
}

export interface PostData {
  url: string | object;
  type: string;
  filterClass: string;
  customFilter: CustomFilter[];
  tagUsers: string[];
  isSensitive: boolean;
  sensitiveContentType: ModerationLabel[] | ContentModerationDetection[];
}
