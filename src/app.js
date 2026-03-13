import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";

import adminRouter from './modules/admin/admin.router.js';
import pageRouter from './modules/page/page.router.js';
import portfolioRouter from './modules/portfolio/portfolio.router.js';
import userRouter from './modules/user/user.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/', pageRouter);
app.use('/api', portfolioRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
