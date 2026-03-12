import express from 'express';

const router = express.Router();

router.get('/users', (req, res) => {
    throw new Error('Not yet implemented');
});

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
