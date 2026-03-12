import express from 'express';
import * as portfolioService from './portfolio.service.js';

const router = express.Router();

router.get('/:username/status', async (req, res) => {
    res.send(await portfolioService.getUserStatus(req.params.username));
});

router.get('/:username/history', async (req, res) => {
    res.send(await portfolioService.getUserHistory(req.params.username));
});

router.get('/:username/portfolio', async (req, res) => {
    res.send(await portfolioService.getUserPortfolioStatus(req.params.username))
});

export default router;
