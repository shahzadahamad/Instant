import { IMusic } from "../../../../infrastructure/database/models/musicModal";

export interface IMusicRepository {
  createMusic(title: string, image: string, music: string): Promise<IMusic | null>
  findMusic(title: string): Promise<IMusic | null>;
  getMusicData(startIndex: number, limit: number, query: { $or?: Array<{ title: { $regex: RegExp } }>; }): Promise<{ music: IMusic[]; totalPages: number; totalMusic: number }>;
  find10Music(query: { title?: { $regex: RegExp }, isListed: boolean }): Promise<{ musicData: IMusic[]; totalMusic: number; }>;
  findById(_id: string): Promise<IMusic | null>;
  findMusicById(_id: string): Promise<IMusic | null>;
  listAndUnlistMusic(_id: string, status: boolean): void;
  updateMusic(_id: string, title: string, image?: string): void;
}