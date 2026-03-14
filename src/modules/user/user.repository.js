import db from '../../config/db.js'

export const create = (username, name, password) => {
    return db.prepare('INSERT INTO user (username, name, password) VALUES (?, ?, ?)').run(username, name, password);
};

export const findAll = () => {
    return db.prepare('SELECT username, name FROM user').all();
};

export const findByUsername = (username) => {
    return db.prepare('SELECT username, name FROM user WHERE username = ?').get(username);
};

export const findByPassword = (username, password) => {
    return db.prepare('SELECT username, name FROM user WHERE username = ? AND password = ?').get(username, password);
};

export const update = (username, name, password) => {
    return db.prepare('UPDATE user SET name = ?, password = ? WHERE username = ?').run(name, password, username);
};

export const deleteByUsername = (username, password) => {
    return db.prepare('DELETE FROM user WHERE username = ? AND password = ?').run(username, password);
};
