import db from '../../config/db.js';

export const create = (username, date, principal, valuation) => {
    return db.prepare('INSERT INTO history (username, date, principal, valuation) VALUES (?, ?, ?, ?)').run(username, date, principal, valuation);
};

export const findAll = () => {
    return db.prepare('SELECT * FROM history').all();
};

export const findByUsername = (username) => {
    return db.prepare('SELECT * FROM history WHERE username = ? ORDER BY date ASC').all(username);
};

export const update = (username, date, principal, valuation) => {
    return db.prepare('UPDATE history SET principal = ?, valuation = ? WHERE username = ? AND date = ?').run(principal, valuation, username, date);
};

export const deleteByDate = (username, dateBegin, dateEnd) => {
    return db.prepare('DELETE FROM history WHERE username = ? AND date >= ? AND date <= ?').run(username, dateBegin, dateEnd);
};
