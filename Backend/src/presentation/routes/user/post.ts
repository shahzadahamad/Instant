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
import ReplyCommentController from "../../../infrastructure/controllers/user/post/replyCommentController";
import LikeOrUnlikeCommentController from "../../../infrastructure/controllers/user/post/likeOrUnlikeCommentController";
import CheckingHasUserLikedCommentController from "../../../infrastructure/controllers/user/post/checkingHasUserLikedCommentController";
import DeleteCommentOrReplyController from "../../../infrastructure/controllers/user/post/deleteCommentOrReplyController";
import GetTaggedPostDataController from "../../../infrastructure/controllers/user/post/getTaggedPostDataController";
import GetLikedPostDataController from "../../../infrastructure/controllers/user/post/getLikedPostDataController";
import ArchiveController from "../../../infrastructure/controllers/user/post/archiveController";
import ArchivedPostController from "../../../infrastructure/controllers/user/post/archivedPostController";
import ReelsController from "../../../infrastructure/controllers/user/post/reelsController";
import SinglePostController from "../../../infrastructure/controllers/user/post/singlePostController";
import FilterReelsController from "../../../infrastructure/controllers/user/post/filterReelsController";

const userPostRouter = Router();

const createPostController = new CreatePostController();
const getUserPostData = new GetUserPostDataController();
const likeOrUnlikePostController = new LikeOrUnlikePostController();
const checkingHasUserLikedPostController = new CheckingHasUserLikedPostController();
const checkingHasUserLikedCommentController = new CheckingHasUserLikedCommentController();
const deletePostController = new DeletePostController();
const getPostCountController = new GetPostCountController();
const getPostDataController = new GetPostDataController();
const editPostController = new EditPostController();
const reportPostController = new ReportPostController();
const commentPostController = new CommentPostController();
const getCommentController = new GetCommentController();
const replyCommentController = new ReplyCommentController();
const likeOrUnlikeCommentController = new LikeOrUnlikeCommentController();
const deleteCommentOrReplyController = new DeleteCommentOrReplyController();
const getTaggedPostDataController = new GetTaggedPostDataController();
const getLikedPostDataController = new GetLikedPostDataController();
const archiveController = new ArchiveController();
const archivedPostController = new ArchivedPostController();
const reelsController = new ReelsController();
const singlePostController = new SinglePostController();
const filterReelsController = new FilterReelsController();

userPostRouter.post("/create-post", authMiddleware, upload.array("files", 10), createPostController.handle);
userPostRouter.get("/get-user-post-data", authMiddleware, getUserPostData.handle);
userPostRouter.patch("/like-or-unlike/:postId/:status", authMiddleware, likeOrUnlikePostController.handle);
userPostRouter.patch("/comment/like-or-unlike/:postId/:commentId/:status", authMiddleware, likeOrUnlikeCommentController.handle);
userPostRouter.get("/has-user-liked-post/:postId", authMiddleware, checkingHasUserLikedPostController.handle);
userPostRouter.get("/has-user-liked-comment/:postId", authMiddleware, checkingHasUserLikedCommentController.handle);
userPostRouter.delete("/delete-post/:postId", authMiddleware, deletePostController.handle);
userPostRouter.get("/post-count", authMiddleware, getPostCountController.handle);
userPostRouter.get("/get-post-data/:postId", authMiddleware, getPostDataController.handle);
userPostRouter.patch("/update-post/:postId", authMiddleware, editPostController.handle);
userPostRouter.patch("/report-post/:postId", authMiddleware, reportPostController.handle);
userPostRouter.post("/comment/:postId", authMiddleware, commentPostController.handle);
userPostRouter.get("/get-comments/:postId", authMiddleware, getCommentController.handle);
userPostRouter.post("/reply-to-comment/:commentId/:postId", authMiddleware, replyCommentController.handle);
userPostRouter.delete("/comment-or-reply/:commentOrReplyId/:actionFor", authMiddleware, deleteCommentOrReplyController.handle);
userPostRouter.get('/tagged', authMiddleware, getTaggedPostDataController.handle);
userPostRouter.get('/liked', authMiddleware, getLikedPostDataController.handle);
userPostRouter.patch('/archive/:postId', authMiddleware, archiveController.handle);
userPostRouter.get('/archived', authMiddleware, archivedPostController.handle);
userPostRouter.get('/reels', authMiddleware, reelsController.handle);
userPostRouter.get('/single/:postId', authMiddleware, singlePostController.handle);
userPostRouter.get('/reels-all', authMiddleware, filterReelsController.handle);

export default userPostRouter;
