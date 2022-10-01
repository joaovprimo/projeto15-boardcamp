import express from "express";
import {checkPostgame, checkGetgame} from '../Middlewares/gameMiddleware.js';
import {postGame, getGames} from '../controllers/gameControllers.js'

const router = express.Router();

router.post('/games', checkPostgame, postGame);
router.get('/games', checkGetgame , getGames);

export default router;