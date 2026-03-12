import db from '../db.js';

/**
 * 외부 API 연동을 가정한 현재가 Mock 함수
 * @param {string} ticker 
 * @returns {Promise<number>}
 */
const getLivePrice = async (ticker) => {
    const MOCK_PRICES = {
        '005930': 71500,  // 삼성전자
        '035720': 44000,  // 카카오
        'TSLA': 185.50,
        'AAPL': 175.20,
    };
    await new Promise(resolve => setTimeout(resolve, 50)); // 네트워크 딜레이 시뮬레이션
    return MOCK_PRICES[ticker] || 0;
};

const getUserTransactions = (userId) => {
    return db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date ASC').all(userId);
};

const calculateHoldingsFromTransactions = (transactions) => {
    const holdings = {}; // { ticker: { quantity: number, totalBuyCost: number, totalBuyQuantity: number } }

    for (const tx of transactions) {
        if (!holdings[tx.ticker]) {
            holdings[tx.ticker] = { quantity: 0, totalBuyCost: 0, totalBuyQuantity: 0 };
        }
        if (tx.type === 'BUY') {
            holdings[tx.ticker].quantity += tx.quantity;
            holdings[tx.ticker].totalBuyCost += tx.quantity * tx.price;
            holdings[tx.ticker].totalBuyQuantity += tx.quantity;
        } else if (tx.type === 'SELL') {
            holdings[tx.ticker].quantity -= tx.quantity;
        }
    }
    return holdings;
};

export const getPortfolioStatus = async (userId) => {
    const transactions = getUserTransactions(userId);
    if (transactions.length === 0) {
        return { totalYield: 0, mood: 'neutral', message: '거래 내역이 없습니다.' };
    }

    const holdings = calculateHoldingsFromTransactions(transactions);

    let totalInvestedCost = 0;
    let totalCurrentValue = 0;

    for (const ticker in holdings) {
        const holding = holdings[ticker];
        if (holding.quantity <= 0) continue;

        const avgBuyPrice = holding.totalBuyCost / holding.totalBuyQuantity;
        const livePrice = await getLivePrice(ticker);

        totalInvestedCost += holding.quantity * avgBuyPrice;
        totalCurrentValue += holding.quantity * livePrice;
    }

    if (totalInvestedCost === 0) {
        return { totalYield: 0, mood: 'neutral', message: '모든 주식을 매도했네요!' };
    }

    const totalYield = ((totalCurrentValue / totalInvestedCost) - 1) * 100;
    const yieldPercent = parseFloat(totalYield.toFixed(2));
    const mood = yieldPercent >= 0 ? 'bull' : 'bear';

    return {
        totalYield: yieldPercent,
        mood: mood,
        message: mood === 'bull' ? '오늘 기분 최고! 치킨 가자!' : '한강 물 온도 체크... (농담)'
    };
};

export const getHoldings = (userId) => {
    const transactions = getUserTransactions(userId);
    const holdings = calculateHoldingsFromTransactions(transactions);
    // 명세에 맞는 형태로 가공하여 반환 (향후 사용을 위해)
    return Object.entries(holdings).filter(([, h]) => h.quantity > 0).map(([ticker, h]) => ({
        ticker,
        quantity: h.quantity,
        purchase_price: parseFloat((h.totalBuyCost / h.totalBuyQuantity).toFixed(2))
    }));
};