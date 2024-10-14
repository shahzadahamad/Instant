import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreatePostController from "../../../infrastructure/controllers/user/post/createPostController";
import { upload } from "../../../infrastructure/configs/multer";
import GetUserPostDataController from "../../../infrastructure/controllers/user/post/getUserPostDataController";
import LikeOrUnlikePostController from "../../../infrastructure/controllers/user/post/likeOrUnlikePostController";
import CheckingHasUserLikedPostController from "../../../infrastructure/controllers/user/post/checkingHasUserLikedPostController";

const userPostRouter = Router();

const createPostController = new CreatePostController();
const getUserPostData = new GetUserPostDataController();
const likeOrUnlikePostController = new LikeOrUnlikePostController();
const checkingHasUserLikedPostController =
  new CheckingHasUserLikedPostController();

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
userPostRouter.get(
  "/has-user-liked-post/:postId",
  authMiddleware,
  checkingHasUserLikedPostController.handle
);

export default userPostRouter;
