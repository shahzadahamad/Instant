import MusicModel, {
  IMusic,
} from "../../../infrastructure/database/models/musicModal";

export default class MusicRepository {
  public async createMusic(
    title: string,
    image: string,
    music: string
  ): Promise<IMusic | null> {
    try {
      const newMusic = await new MusicModel({
        title,
        image,
        music,
      });
      return await newMusic.save();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new Error("failed to create music!");
      }
      console.error("Unknown error creating music");
      throw new Error("Unknown error");
    }
  }
  public async findMusic(title: string): Promise<IMusic | null> {
    try {
      return await MusicModel.findOne({ title });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new Error("failed to create music!");
      }
      console.error("Unknown error creating music");
      throw new Error("Unknown error");
    }
  }
}
