import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreatePostController from "../../../infrastructure/controllers/user/post/createPostController";
import { upload } from "../../../infrastructure/configs/multer";
import GetUserPostDataController from "../../../infrastructure/controllers/user/post/getUserPostDataController";

const userPostRouter = Router();

const createPostController = new CreatePostController();
const getUserPostData = new GetUserPostDataController();

userPostRouter.post(
  "/create-post",
  authMiddleware,
  upload.array("files", 10),
  createPostController.handle
);
userPostRouter.get(
  "/get-user-post-data",
  authMiddleware,
  getUserPostData.handle
);

export default userPostRouter;
