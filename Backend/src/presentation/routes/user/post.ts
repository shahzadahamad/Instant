import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreatePostController from "../../../infrastructure/controllers/user/post/createPostController";
import { upload } from "../../../infrastructure/configs/multer";
import GetUserPostDataController from "../../../infrastructure/controllers/user/post/getUserPostDataController";
import LikeOrUnlikePostController from "../../../infrastructure/controllers/user/post/likeOrUnlikePostController";

const userPostRouter = Router();

const createPostController = new CreatePostController();
const getUserPostData = new GetUserPostDataController();
const likeOrUnlikePostController = new LikeOrUnlikePostController();

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
userPostRouter.patch(
  "/like-or-unlike/:postId/:status",
  authMiddleware,
  likeOrUnlikePostController.handle
);

export default userPostRouter;
