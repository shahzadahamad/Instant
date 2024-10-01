import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import GetCreatePostMusicDataController from "../../../infrastructure/controllers/user/music/getCreatePostMusicDataController";

const userMusicRouter = Router();

const getCreatePostMusicDataController = new GetCreatePostMusicDataController();

userMusicRouter.get(
  "/create-post/get-data",
  authMiddleware,
  getCreatePostMusicDataController.handle
);

export default userMusicRouter;
