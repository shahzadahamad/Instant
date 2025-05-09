import StoryModal, { IStory } from "../../../../infrastructure/database/models/storyModal";
import { StoryData } from "../../../interface/post";
import { IStoryRepository } from "../interfaces/IStoryRepository";

export default class StoryRepository implements IStoryRepository {
  public async createStory(userId: string, story: StoryData, musicId: string): Promise<IStory> {
    try {
      const newPost = await new StoryModal({
        userId,
        story,
        musicId,
        seenBy: [],
        reportDetials: [],
      });
      return await newPost.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating post: ${error.message}`);
        throw new Error("Failed to create post");
      }
      console.error("Unknown error creating post");
      throw new Error("Unknown error");
    }
  }

  public async findStoriesByUsers(userIds: string[], afterDate: Date): Promise<IStory[]> {
    return await StoryModal.find({ userId: { $in: userIds }, createdAt: { $gte: afterDate } });
  }

}
