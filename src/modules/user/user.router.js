import express from 'express';
import * as userService from './user.service.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(userService.getAllUsers());
});

router.get('/:username', (req, res) => {
    res.json(userService.getUserbyUsername(req.params.username));
});

export default router;
