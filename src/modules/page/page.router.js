import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { tryLogin, isAuthenticated } from '../auth/auth.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/index.html'));
});

router.get('/:username', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/detail.html'));
});

router.get('/:username/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/login.html'));
});
router.post('/:username/login', tryLogin, (req, res) => {
    res.redirect('/' + req.params.username + '/edit');
});

router.get('/:username/edit', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/edit.html'));
});

export default router;
