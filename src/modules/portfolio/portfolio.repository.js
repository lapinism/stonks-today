import db from '../../config/db.js';

export const create = (username, ticker, quantity, price) => {
    return db.prepare('INSERT INTO portfolio (username, ticker, quantity, price) VALUES (?, ?, ?, ?)').run(username, ticker, quantity, price);
};

export const findAll = () => {
    return db.prepare('SELECT * FROM portfolio').all();
};

export const findByUsername = (username) => {
    return db.prepare('SELECT * FROM portfolio WHERE username = ?').all(username);
};

export const findByTicker = (username, ticker) => {
    return db.prepare('SELECT * FROM portfolio WHERE username = ? AND ticker = ?').run(username, ticker);
};

export const update = (username, ticker, quantity, price) => {
    return db.prepare('UPDATE portfolio SET quantity = ?, price = ? WHERE username = ? AND ticker = ?').run(quantity, price, username, ticker);
};

export const deleteByTicker = (username, ticker) => {
    return db.prepare('DELETE FROM portfolio WHERE username = ? AND ticker = ?').run(username, ticker);
};
