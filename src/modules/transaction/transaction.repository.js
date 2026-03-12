import db from '../../config/db.js'

export const findAll = () => {
    return db.prepare('SELECT * FROM transactions').all();
}

export const findByUsername = (username) => {
    return db.prepare('SELECT * FROM transactions WHERE username = ?').all(username);
}

export const add = (transaction) => {
    const stmt = db.prepare('INSERT INTO transactions (username, date, type, ticker, quantity, price) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(transaction.username, transaction.date, transaction.type, transaction.ticker, transaction.quantity, transaction.price);
}
