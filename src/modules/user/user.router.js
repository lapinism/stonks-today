import express from 'express';
import * as userService from './user.service.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(userService.getAllUsers());
});
router.get('/:username', (req, res) => {
    res.json(userService.getUserbyUsername(req.params.username));
});

router.post('/', (req, res) => {
    const { username, name, password } = req.body;
    userService.createUser(username, name, password);
    res.status(201).send(userService.findByUsername(username));
});

router.put('/', (req, res) => {
    const { username, name, password } = req.body;
    userService.updateUser(username, name, password);
    res.status(204).send();
});

router.delete('/', (req, res) => {
    const { username, password } = req.body;
    userService.deleteUser(username, password);
    res.status(204).send();
});


export default router;
