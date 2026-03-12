import express from 'express';
import * as userService from './user.service.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(userService.findAllUser());
});

router.get('/:username', (req, res) => {
    res.json(userService.findUserByUsername(req.params.username));
});

export default router;
