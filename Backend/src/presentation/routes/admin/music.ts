import { Router } from "express";
import { upload } from "../../../infrastructure/configs/multer";
import CreateMusicController from "../../../infrastructure/controllers/admin/music/createMusicController";
import adminAuthMiddleware from "../../../infrastructure/middlewares/adminAuthMiddleware";
import GetMusicDataController from "../../../infrastructure/controllers/admin/music/getMusicDataController";
import ListAndUnlistMuciAdminController from "../../../infrastructure/controllers/admin/music/listAndUnlistMuciAdminController";
import EditMusicController from "../../../infrastructure/controllers/admin/music/editMusicController";

const musicRouter = Router();

const createMusicController = new CreateMusicController();
const getMusicDataController = new GetMusicDataController();
const listAndUnlistMuciAdminController = new ListAndUnlistMuciAdminController();
const editMusicController = new EditMusicController();

musicRouter.post(
  "/create-music",
  adminAuthMiddleware,
  upload.fields([{ name: "image" }, { name: "audio" }]),
  createMusicController.handle
);
musicRouter.get("/get-data", getMusicDataController.handle);
musicRouter.patch(
  "/listed-or-unlisted/:id/:status",
  adminAuthMiddleware,
  listAndUnlistMuciAdminController.handle
);
musicRouter.patch(
  "/edit-music/:_id",
  adminAuthMiddleware,
  upload.single("image"),
  editMusicController.handle
);

export default musicRouter;
