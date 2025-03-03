import { Router } from "express";
import authMiddleware from "../../../infrastructure/middlewares/authMiddleware";
import SearchController from "../../../infrastructure/controllers/user/search/searchController";
import SearchHistoryController from "../../../infrastructure/controllers/user/search/searchHistoryController";
import SearchHistoryAddController from "../../../infrastructure/controllers/user/search/searchHistoryAddController";
import RemoveController from "../../../infrastructure/controllers/user/search/removeController";
import RemoveAllController from "../../../infrastructure/controllers/user/search/removeAllController";

const searchRoute = Router();

const searchController = new SearchController();
const searchHistoryController = new SearchHistoryController();
const searchHistoryAddController = new SearchHistoryAddController();
const removeController = new RemoveController();
const removeAllController = new RemoveAllController();

searchRoute.get("/:search", authMiddleware, searchController.handle);
searchRoute.get("/", authMiddleware, searchHistoryController.handle);
searchRoute.post("/add/:_id", authMiddleware, searchHistoryAddController.handle);
searchRoute.delete('/all', authMiddleware, removeAllController.handle);
searchRoute.delete('/:_id', authMiddleware, removeController.handle);

export default searchRoute;
