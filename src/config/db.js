import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', '..', 'db', 'sqlite.db');
const db = new Database(dbPath, { fileMustExist: true });
db.pragma('journal_mode = WAL');

export default db;
