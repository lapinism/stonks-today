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
    username TEXT PRIMARY KEY UNIQUE NOT NULL
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
  )
`);

console.log('Tables created successfully.');

// 테스트용 데이터 준비
const insertUser = db.prepare('INSERT INTO users (username) VALUES (?)');
const insertTransaction = db.prepare('INSERT INTO transactions (username, date, type, ticker, quantity, price) VALUES (?, ?, ?, ?, ?, ?)');

const users = [
    { username: 'user1' },
    { username: 'user2' },
];

const transactions = [
  // user1 거래 내역
  { username: 'user1', date: '2023-10-01', type: 'BUY', ticker: '005930', quantity: 10, price: 70000 },
  { username: 'user1', date: '2023-10-05', type: 'BUY', ticker: '035720', quantity: 5, price: 85000 },
  { username: 'user1', date: '2023-10-20', type: 'SELL', ticker: '035720', quantity: 2, price: 90000 },

  // friend1 거래 내역
  { username: 'user2', date: '2023-09-20', type: 'BUY', ticker: 'TSLA', quantity: 20, price: 250.00 },
  { username: 'user2', date: '2023-10-10', type: 'BUY', ticker: 'AAPL', quantity: 50, price: 170.00 },
];

// 트랜잭션으로 데이터 삽입
db.transaction(() => {
  users.forEach(user => insertUser.run(user.username));
  transactions.forEach(tx => insertTransaction.run(tx.username, tx.date, tx.type, tx.ticker, tx.quantity, tx.price));
})();

console.log('Dummy data seeded successfully.');
db.close();