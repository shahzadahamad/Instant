import { Area } from "react-easy-crop";
import { createImage } from "./createImage";

export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (canvas && ctx) {
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      }, "image/jpeg");
    });
  }

  throw new Error("Canvas or context not available");
};
