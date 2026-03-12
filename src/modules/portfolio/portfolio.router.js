import express from 'express';
import * as portfolioService from './portfolio.service.js';

const router = express.Router();

router.get('/:username/status', (req, res) => {
    throw new Error('Not yet implemented');
});

router.get('/:username/history', (req, res) => {
    throw new Error('Not yet implemented');
});

router.get('/:username/portfolio', (req, res) => {
    throw new Error('Not yet implemented');
});

export default router;
