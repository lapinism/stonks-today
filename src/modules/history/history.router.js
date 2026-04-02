import express from 'express';
import * as historyService from './history.service.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const { period } = req.query;
    res.send(await historyService.getHistoryByUsername(username, period));
});

export default router;
