import db from '../../config/db.js'

export const findAll = () => {
    return db.prepare('SELECT * FROM users').all();
}

export const findByUsername = (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').all(username);
}

export const add = (user) => {
    const stmt = db.prepare('INSERT INTO users (username, name) VALUES (?, ?)');
    stmt.run(user.username, user.name);
}

export const remove = (username) => {
    const stmt = db.prepare('DELETE FROM users WHERE username = ?');
    stmt.run(username);
}
