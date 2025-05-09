import { IStory } from "../../../../infrastructure/database/models/storyModal";
import { StoryData } from "../../../interface/post";

export interface IStoryRepository {
  createStory(userId: string, story: StoryData, musicId: string): Promise<IStory>;
}