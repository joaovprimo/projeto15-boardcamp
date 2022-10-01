import express from "express";
import {getCategories, postCategories} from "../controllers/categoryControllers.js";
import {existCategories, nameCategories} from "../Middlewares/categoryMiddleware.js"

const router = express.Router();

router.get('/categories', existCategories ,getCategories);
router.post('/categories', nameCategories,postCategories);

export default router;