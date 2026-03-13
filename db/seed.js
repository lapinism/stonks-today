import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'sqlite.db'));

db.exec('DROP TABLE IF EXISTS transactions');
db.exec('DROP TABLE IF EXISTS users');

db.exec(`
  CREATE TABLE users (
    username TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL')),
    ticker TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
  )
`);

console.log('Tables created successfully.');

// 테스트용 데이터 준비
const insertUser = db.prepare('INSERT INTO users (username, name) VALUES (?, ?)');
const insertTransaction = db.prepare('INSERT INTO transactions (username, date, type, ticker, quantity, price) VALUES (?, ?, ?, ?, ?, ?)');

const users = [
    { username: 'lim', name: '임스피' },
    { username: 'yoon', name: '윤스피' },
];

const transactions = [
    { username: 'lim', date: '2023-09-20', type: 'BUY', ticker: '011790', quantity: 10, price: 106100 },
    { username: 'lim', date: '2023-09-20', type: 'BUY', ticker: 'NU', quantity: 101, price: 20727.16831683168 },
    { username: 'lim', date: '2023-09-20', type: 'BUY', ticker: 'STNE', quantity: 160, price: 22457.90625 },
    { username: 'lim', date: '2023-10-10', type: 'BUY', ticker: 'TEM', quantity: 20, price: 78930.65 },
    { username: 'lim', date: '2023-10-10', type: 'BUY', ticker: 'NUG', quantity: 60, price: 17312.71666666667 },

    { username: 'yoon', date: '2023-10-05', type: 'BUY', ticker: 'STNE', quantity: 10, price: 20688.4 },
    { username: 'yoon', date: '2023-10-05', type: 'BUY', ticker: '005930', quantity: 11, price: 184963.6363636364 },
    { username: 'yoon', date: '2023-10-05', type: 'BUY', ticker: '229200', quantity: 100, price: 20160 },
    { username: 'yoon', date: '2023-10-05', type: 'BUY', ticker: '396500', quantity: 50, price: 35814.5 },
];

// 트랜잭션으로 데이터 삽입
db.transaction(() => {
    users.forEach(user => insertUser.run(user.username, user.name));
    transactions.forEach(tx => insertTransaction.run(tx.username, tx.date, tx.type, tx.ticker, tx.quantity, tx.price));
})();

console.log('Dummy data seeded successfully.');
db.close();