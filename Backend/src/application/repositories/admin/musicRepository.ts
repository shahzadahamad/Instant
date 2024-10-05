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
  public async getMusicData(
    startIndex: number,
    limit: number,
    query: {}
  ): Promise<{ music: any; totalPages: number; totalMusic: number }> {
    try {
      const totalMusic = await MusicModel.countDocuments();
      const searchTotalMusic = await MusicModel.countDocuments(query);
      const music = await MusicModel.find(query).skip(startIndex).limit(limit);
      return {
        music,
        totalPages: Math.ceil(searchTotalMusic / limit),
        totalMusic,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find music");
      }
      console.error("Unknown error finding music");
      throw new Error("Unknown error");
    }
  }

  public async find10Music(query: {}): Promise<{
    musicData: IMusic[];
    totalMusic: number;
  }> {
    try {
      const totalMusic = await MusicModel.countDocuments();
      const musicData = await MusicModel.find(query).limit(10);
      return { musicData, totalMusic };
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find music");
      }
      console.error("Unknown error finding music");
      throw new Error("Unknown error");
    }
  }

  public async findById(_id: string): Promise<IMusic | null> {
    try {
      const totalMusic = await MusicModel.findOne({ _id: _id, isListed: true });
      return totalMusic;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error find user: ${error.message}`);
        throw new Error("Failed to find music");
      }
      console.error("Unknown error finding music");
      throw new Error("Unknown error");
    }
  }

  public async listAndUnlistMusic(_id: string, status: boolean) {
    try {
      await MusicModel.updateOne({ _id: _id }, { $set: { isListed: status } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Invalid Access!");
      }
      console.error("Unknown error edit music");
      throw new Error("Unknown error");
    }
  }
}
