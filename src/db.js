import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'db', 'sqlite.db');
// fileMustExist 옵션으로 seed 스크립트가 먼저 실행되도록 강제합니다.
const db = new Database(dbPath, { fileMustExist: true });
db.pragma('journal_mode = WAL'); // 동시성 향상을 위해 WAL 모드 활성화

export default db;