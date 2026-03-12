import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

const db = new Database(path.join(dbDir, 'sqlite.db'));

// 더 안정적인 실행을 위해 기존 테이블 삭제
db.exec('DROP TABLE IF EXISTS transactions');
db.exec('DROP TABLE IF EXISTS users');

// 명세에 따른 테이블 생성
db.exec(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('BUY', 'SELL')),
    ticker TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

console.log('✅ Tables created successfully.');

// 테스트용 데이터 준비
const insertUser = db.prepare('INSERT INTO users (id, name) VALUES (?, ?)');
const insertTransaction = db.prepare('INSERT INTO transactions (user_id, date, type, ticker, quantity, price) VALUES (?, ?, ?, ?, ?, ?)');

const users = [
  { id: 'user1', name: 'Me' },
  { id: 'friend1', name: 'Elon' },
];

const transactions = [
  // user1 거래 내역
  { user_id: 'user1', date: '2023-10-01', type: 'BUY', ticker: '005930', quantity: 10, price: 70000 },
  { user_id: 'user1', date: '2023-10-05', type: 'BUY', ticker: '035720', quantity: 5, price: 85000 },
  { user_id: 'user1', date: '2023-10-20', type: 'SELL', ticker: '035720', quantity: 2, price: 90000 },

  // friend1 거래 내역
  { user_id: 'friend1', date: '2023-09-20', type: 'BUY', ticker: 'TSLA', quantity: 20, price: 250.00 },
  { user_id: 'friend1', date: '2023-10-10', type: 'BUY', ticker: 'AAPL', quantity: 50, price: 170.00 },
];

// 트랜잭션으로 데이터 삽입
db.transaction(() => {
  users.forEach(user => insertUser.run(user.id, user.name));
  transactions.forEach(tx => insertTransaction.run(tx.user_id, tx.date, tx.type, tx.ticker, tx.quantity, tx.price));
})();

console.log('✅ Dummy data seeded successfully.');
db.close();