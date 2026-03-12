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
    { username: 'user1', name: '김' },
    { username: 'user2', name: '이' },
];

const transactions = [
    // user1 거래 내역
    // { username: 'user1', date: '2023-10-01', type: 'BUY', ticker: '005930', quantity: 10, price: 70000 },
    // { username: 'user1', date: '2023-10-05', type: 'BUY', ticker: '035720', quantity: 5, price: 85000 },
    // { username: 'user1', date: '2023-10-20', type: 'SELL', ticker: '035720', quantity: 2, price: 90000 },
    { username: 'user1', date: '2023-10-05', type: 'BUY', ticker: '035720', quantity: 16, price: 51800 },
    { username: 'user1', date: '2023-10-05', type: 'BUY', ticker: '035420', quantity: 4, price: 221500 },

    // friend1 거래 내역
    { username: 'user2', date: '2023-09-20', type: 'BUY', ticker: '011790', quantity: 10, price: 106100 },
    { username: 'user2', date: '2023-09-20', type: 'BUY', ticker: 'NU', quantity: 101, price: 20727.16831683168 },
    { username: 'user2', date: '2023-09-20', type: 'BUY', ticker: 'STNE', quantity: 160, price: 22457.90625 },
    { username: 'user2', date: '2023-10-10', type: 'BUY', ticker: 'TEM', quantity: 20, price: 78930.65 },
    { username: 'user2', date: '2023-10-10', type: 'BUY', ticker: 'NUG', quantity: 60, price: 17312.71666666667 },
];

// 트랜잭션으로 데이터 삽입
db.transaction(() => {
    users.forEach(user => insertUser.run(user.username, user.name));
    transactions.forEach(tx => insertTransaction.run(tx.username, tx.date, tx.type, tx.ticker, tx.quantity, tx.price));
})();

console.log('Dummy data seeded successfully.');
db.close();