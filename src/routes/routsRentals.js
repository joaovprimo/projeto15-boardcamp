import express from "express";
import { checkPostRentals } from "../Middlewares/rentalsMiddlewares.js";
import {postRentals} from '../controllers/rentalsControllers.js';

const router = express.Router();

router.post('/rentals',checkPostRentals, postRentals)

export default router;
