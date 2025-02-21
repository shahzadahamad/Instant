import sharp from "sharp";

export default class Sharp {
  public async makeCircularImage(buffer: Buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      const size = Math.min(metadata.width!, metadata.height!);

      const circleMask = Buffer.from(
        `<svg width="${size}" height="${size}">
              <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
          </svg>`
      );

      return await sharp(buffer)
        .resize(size, size)
        .composite([{ input: circleMask, blend: "dest-in" }])
        .png({ quality: 100 })
        .toBuffer();

    } catch (error) {
      console.error("Error makeing circular image: ", error);
      throw new Error("Failed to Upload Image");
    }
  }
}
