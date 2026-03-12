import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPortfolioStatus } from './modules/portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// API 라우트: 포트폴리오 상태 반환
app.get('/api/status', async (req, res) => {
    try {
        const status = await getPortfolioStatus('user1');
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate stonks' });
    }
});

export default app;