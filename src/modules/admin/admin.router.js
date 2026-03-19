import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import * as adminService from './admin.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', adminService.isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/admin.html'));
});
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/login.html'));
});

router.post('/login', adminService.tryAdminLogin, adminService.isAdmin, (req, res) => {
    res.redirect('/admin');
});

router.post('/users', adminService.isAdmin, (req, res) => {
    console.warn(`${req.ip} tried to add new user`);
    try {
        adminService.addUser(req.body);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(201);
});

router.post('/portfolios', adminService.isAdmin, (req, res) => {
    console.warn(`${req.ip} tried to add new transaction`);
    try {
        adminService.addTransaction(req.body);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(201);
});

router.delete('/histories', adminService.isAdmin, (req, res) => {
    console.warn(`${req.ip} tried to delete history`);
    try {
        adminService.deleteHistory(req.body);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(204);
});


export default router;
