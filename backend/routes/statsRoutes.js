import express from 'express';
import GetStats from '../controllers/Stats/GetStats.js';
const router = express.Router();

router.get('/get', GetStats);

export default router;
