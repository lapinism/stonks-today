import * as historyRepository from '../history/history.repository.js';
import * as portfolioRepository from '../portfolio/portfolio.repository.js';
import * as userRepository from '../user/user.repository.js';

export const addUser = (data) => {
    userRepository.create(data.username, data.name, data.password);
    console.log(`New user added`);
    data.userpw = '********';
    console.log(data)
};

export const addTransaction = (data) => {
    portfolioRepository.create(data.username, data.ticker, data.quantity, data.price);
    console.log(`New transaction added`);
    console.log(data);
};

export const deleteHistory = (data) => {
    historyRepository.deleteByDate(data.username, data.dateBegin, data.dateEnd);
    console.log(`History deleted`);
    console.log(data);
};

export const tryAdminLogin = (req, res, next) => {
    const password = req.body.password;
    console.warn(`Admin login attempt from ${req.ip}`);
    if (req.body.password === process.env.ADMIN_PASSWORD) {
        console.warn(`${req.ip} logged in as admin`);
        req.session.username = 'admin';
    }
    next();
};

export const isAdmin = (req, res, next) => {
    if (req.session.username !== 'admin') {
        res.redirect('/admin/login');
        return;
    }
    next();
};
