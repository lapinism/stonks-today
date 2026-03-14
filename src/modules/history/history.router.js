import express from 'express';
import * as historyService from './history.service.js';

const router = express.Router();

router.get('/:username', async (req, res) => {
    res.send(await historyService.getHistoryByUsername(req.params.username));
});

export default router;
