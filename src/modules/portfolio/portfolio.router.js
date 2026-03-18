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

router.post('/:username', isAuthenticated, portfolioService.verifyPortfolio, (req, res) => {
    portfolioService.createPortfolio(req.params.username, req.body.ticker, req.body.quantity, req.body.price);
    res.sendStatus(201);
});

router.put('/:username', isAuthenticated, portfolioService.verifyPortfolio, (req, res) => {
    portfolioService.updatePortfolio(req.params.username, req.body.ticker, req.body.quantity, req.body.price);
    res.sendStatus(204);
});

router.delete('/:username', isAuthenticated, (req, res) => {
    portfolioService.deletePortfolio(req.params.username, req.body.ticker);
    res.sendStatus(204);
});


export default router;
