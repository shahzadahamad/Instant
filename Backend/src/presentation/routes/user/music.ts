import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import GetCreatePostMusicDataController from "../../../infrastructure/controllers/user/music/getCreatePostMusicDataController";
import GetCreatePostSelectMusicDataController from "../../../infrastructure/controllers/user/music/getCreatePostSelectMusicDataController";

const userMusicRouter = Router();

const getCreatePostMusicDataController = new GetCreatePostMusicDataController();
const getCreatePostSelectMusicDataController = new GetCreatePostSelectMusicDataController();

userMusicRouter.get(
  "/create-post/get-data",
  authMiddleware,
  getCreatePostMusicDataController.handle
);
userMusicRouter.get(
  "/create-post/get-selected-music-data/:_id",
  authMiddleware,
  getCreatePostSelectMusicDataController.handle
);

export default userMusicRouter;
