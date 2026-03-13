import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import * as adminService from './admin.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/admin.html'));
});

router.post('/users', (req, res) => {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
        console.warn(`${req.ip} tried to add new user`);
        adminService.addUser(req.body);
        res.redirect('/admin');
    }
    else {
        console.warn(`${req.ip} tried to login with wrong password`);
        res.status(401).send('Unauthorized');
    }
});

router.post('/transactions', (req, res) => {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
        console.warn(`${req.ip} tried to add new transaction`);
        adminService.addTransaction(req.body);
        res.redirect('/admin');
    }
    else {
        console.warn(`${req.ip} tried to login with wrong password`);
        res.status(401).send('Unauthorized');
    }
});

export default router;
