import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'sqlite.db'));

// Create new Table
db.exec('DROP TABLE IF EXISTS user');
db.exec('DROP TABLE IF EXISTS portfolio');
db.exec('DROP TABLE IF EXISTS history');

db.exec(`
  CREATE TABLE user (
    username TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    ticker TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (username) REFERENCES user (username)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
  )
`);
db.exec(`
  CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    date TEXT NOT NULL,
    principal REAL NOT NULL,
    valuation REAL NOT NULL,
    FOREIGN KEY (username) REFERENCES user (username)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
  )
`)

console.log('Tables created successfully.');


// Prepare dummy data
const insertUser = db.prepare('INSERT INTO user (username, name, password) VALUES (?, ?, ?)');
const insertPortfolio = db.prepare('INSERT INTO portfolio (username, ticker, quantity, price) VALUES (?, ?, ?, ?)');

const users = [
    { username: 'lim', name: '임스피', password: '1234' },
    { username: 'yoon', name: '윤스피', password: '1234' },
];

const portfolio = [
    { username: 'lim', ticker: '011790', quantity: 10, price: 106100 },
    { username: 'lim', ticker: 'NU', quantity: 101, price: 20727.16831683168 },
    { username: 'lim', ticker: 'STNE', quantity: 160, price: 22457.90625 },
    { username: 'lim', ticker: 'TEM', quantity: 20, price: 78930.65 },
    { username: 'lim', ticker: 'NUG', quantity: 60, price: 17312.71666666667 },

    { username: 'yoon', ticker: 'STNE', quantity: 10, price: 20688.4 },
    { username: 'yoon', ticker: '005930', quantity: 11, price: 184963.6363636364 },
    { username: 'yoon', ticker: '229200', quantity: 100, price: 20160 },
    { username: 'yoon', ticker: '396500', quantity: 50, price: 35814.5 },
];

db.transaction(() => {
    users.forEach(user => insertUser.run(user.username, user.name, user.password));
    portfolio.forEach(stock => insertPortfolio.run(stock.username, stock.ticker, stock.quantity, stock.price));
})();

console.log('Dummy data seeded successfully.');
db.close();
