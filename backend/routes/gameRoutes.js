import express from 'express';
import { startGame,takeTiles, setupGame, getGame, deleteGame } from '../controllers/gameController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/setup', protectRoute, setupGame);

router.get('/get/:id', protectRoute, getGame);

router.delete('/delete', protectRoute, deleteGame);

router.post('/start', protectRoute, startGame);

router.post('/take', protectRoute, takeTiles);

export default router;