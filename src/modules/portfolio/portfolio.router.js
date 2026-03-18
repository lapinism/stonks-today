import express from 'express';
import * as portfolioService from './portfolio.service.js';
import { isAuthenticated } from '../auth/auth.service.js';

const router = express.Router();

router.get('/:username', isAuthenticated, async (req, res) => {
    res.send(await portfolioService.getPortfolioByUsername(req.params.username));
});
router.get('/:username/status', async (req, res) => {
    res.send(await portfolioService.getPortfolioStatusByUsername(req.params.username));
});

export default router;
