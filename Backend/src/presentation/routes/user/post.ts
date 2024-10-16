import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import CreatePostController from "../../../infrastructure/controllers/user/post/createPostController";
import { upload } from "../../../infrastructure/configs/multer";
import GetUserPostDataController from "../../../infrastructure/controllers/user/post/getUserPostDataController";
import LikeOrUnlikePostController from "../../../infrastructure/controllers/user/post/likeOrUnlikePostController";
import CheckingHasUserLikedPostController from "../../../infrastructure/controllers/user/post/checkingHasUserLikedPostController";
import DeletePostController from "../../../infrastructure/controllers/user/post/deletePostController";
import GetPostCountController from "../../../infrastructure/controllers/user/post/getPostCountController";
import GetPostDataController from "../../../infrastructure/controllers/user/post/getPostDataController";
import EditPostController from "../../../infrastructure/controllers/user/post/editPostController";
import ReportPostController from "../../../infrastructure/controllers/user/post/reportPostController";
import CommentPostController from "../../../infrastructure/controllers/user/post/commentPostController";
import GetCommentController from "../../../infrastructure/controllers/user/post/getCommentController";

const userPostRouter = Router();

const createPostController = new CreatePostController();
const getUserPostData = new GetUserPostDataController();
const likeOrUnlikePostController = new LikeOrUnlikePostController();
const checkingHasUserLikedPostController =
  new CheckingHasUserLikedPostController();
const deletePostController = new DeletePostController();
const getPostCountController = new GetPostCountController();
const getPostDataController = new GetPostDataController();
const editPostController = new EditPostController();
const reportPostController = new ReportPostController();
const commentPostController = new CommentPostController();
const getCommentController = new GetCommentController();

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
userPostRouter.delete(
  "/delete-post/:postId",
  authMiddleware,
  deletePostController.handle
);
userPostRouter.get(
  "/post-count",
  authMiddleware,
  getPostCountController.handle
);
userPostRouter.get(
  "/get-post-data/:postId",
  authMiddleware,
  getPostDataController.handle
);
userPostRouter.patch(
  "/update-post/:postId",
  authMiddleware,
  editPostController.handle
);
userPostRouter.patch(
  "/report-post/:postId",
  authMiddleware,
  reportPostController.handle
);
userPostRouter.post(
  "/comment/:postId",
  authMiddleware,
  commentPostController.handle
);
userPostRouter.get(
  "/get-comments/:postId",
  authMiddleware,
  getCommentController.handle
);

export default userPostRouter;
