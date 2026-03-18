import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from "url";

import adminRouter from './modules/admin/admin.router.js';
import pageRouter from './modules/page/page.router.js';
import historyRouter from './modules/history/history.router.js';
import portfolioRouter from './modules/portfolio/portfolio.router.js';
import userRouter from './modules/user/user.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 300000
    }
}));

app.use('/admin', adminRouter);
app.use('/', pageRouter);
app.use('/api/histories', historyRouter);
app.use('/api/portfolios', portfolioRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
