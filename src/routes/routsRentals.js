import express from "express";
import { checkPostRentals, checkGetGameRentals, checkReturnGameRentals, checkDeleteGameRentals } from "../Middlewares/rentalsMiddlewares.js";
import {postRentals, getRentals, returnRentals, deleteRentals } from '../controllers/rentalsControllers.js';

const router = express.Router();

router.post('/rentals',checkPostRentals, postRentals);
router.get('/rentals',checkGetGameRentals, getRentals);
router.post('/rentals/:id/return',checkReturnGameRentals, returnRentals);
router.delete('/rentals/:id',checkDeleteGameRentals, deleteRentals);

export default router;
