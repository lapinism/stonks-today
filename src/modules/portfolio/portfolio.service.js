import * as portfolioRepository from '../transaction/transaction.repository.js';
import * as userRepository from '../user/user.repository.js';

const updateHoldings = (transaction, holdings) => {
    if (!holdings[transaction.ticker]) {
        holdings[transaction.ticker] = { quantity: 0, price: 0 };
    }
    if (transaction.type === 'BUY') {
        holdings[transaction.ticker].price *= holdings[transaction.ticker].quantity;
        holdings[transaction.ticker].price += transaction.quantity * transaction.price;

        holdings[transaction.ticker].quantity += transaction.quantity;
        holdings[transaction.ticker].price /= holdings[transaction.ticker].quantity;
    }
    else {
        holdings[transaction.ticker].quantity -= transaction.quantity;
    }
};

const fetchChartData = async (ticker) => {
    const ret = {};

    if (isNaN(ticker)) {
        const data = await fetch(`https://example.com/`);
        const json = await data.json();

        const timestamp = json.chart.result[0].timestamp;
        const close = json.chart.result[0].indicators.quote[0].close;

        const rateData = await fetch(`https://example.com/`);
        const rateJson = await rateData.json();
        const USD2KRW = rateJson[0].rate;

        for (let i = 0; i < close.length; i++) {
            ret[new Date(timestamp[i] * 1000).toISOString().slice(0, 10)] = close[i] * USD2KRW;
        }
    }
    else {
        const currentDate = new Date();
        const twoMonthAgo = new Date();
        twoMonthAgo.setMonth(currentDate.getMonth() - 2);
        const dateStr = twoMonthAgo.toISOString().slice(0,10).replace(/-/g, '');

        const data = await fetch(`https://example.com/`);
        const text = await data.text();
        const json = JSON.parse(text.replace(/'/g, '"'))

        for (let i = 1; i < json.length; i++) {
            ret[json[i][0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")] = json[i][4];
        }
    }

    for (let i = 0; i <= 40; i++) {
        const currentDate = new Date();
        currentDate.setDate(new Date().getDate() - 40 + i);
        const dateStr = currentDate.toISOString().slice(0,10);
        if (!ret[dateStr]) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(currentDate.getDate() - 1);
            ret[dateStr] = ret[prevDate.toISOString().slice(0,10)];
        }
    }

    return ret;
};

const calcProfitHistory = async (username) => {
    let transactions = portfolioRepository.findByUsername(username);
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let holdings = {}; // { ticker: { quantity, price } }
    let chartData = {}; // { ticker: { date: close ... } }

    for (const transaction of transactions) {
        if (!chartData[transaction.ticker]) {
            chartData[transaction.ticker] = await fetchChartData(transaction.ticker);
        }
    }

    const prePeriodTxs = transactions.filter(transaction => new Date(transaction.date) < thirtyDaysAgo);
    const periodTxs = transactions.filter(transaction => new Date(transaction.date) >= thirtyDaysAgo);

    prePeriodTxs.forEach((transaction) => {
        updateHoldings(transaction, holdings);
    });

    let ret = [];
    let currentTxsIdx = 0;
    for (let i = 0; i <= 30; i++) {
        const currentDate = new Date(thirtyDaysAgo);
        currentDate.setDate(thirtyDaysAgo.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        while (currentTxsIdx < periodTxs.length && periodTxs[currentTxsIdx].date === dateStr) {
            updateHoldings(periodTxs[currentTxsIdx], holdings);
            currentTxsIdx++;
        }

        let totalValue = 0;
        let currentValue = 0;
        for (const ticker in holdings) {
            if (holdings[ticker].quantity > 0) {
                totalValue += holdings[ticker].quantity * holdings[ticker].price;
                currentValue += holdings[ticker].quantity * chartData[ticker][dateStr];
            }
        }

        // const dailyYield = totalValue === 0 ? 1 : ((currentValue / totalValue) - 1);
        ret.push(currentValue - totalValue);
    }

    return ret;
};

const calcPortfolioStatus = async (username) => {
    let holdings = {};
    portfolioRepository.findByUsername(username).forEach((transaction) => {
        updateHoldings(transaction, holdings);
    });
    let ret = { currentValue: 0, totalValue: 0, yield: 0, portfolio: [] };

    const today = new Date();
    const dateStr = today.toISOString().slice(0,10);

    for (const ticker in holdings) {
        if (holdings[ticker].quantity > 0) {
            const chartData = await fetchChartData(ticker);
            ret.totalValue += holdings[ticker].quantity * holdings[ticker].price;
            ret.currentValue += holdings[ticker].quantity * chartData[dateStr];
            ret.portfolio.push({
                ticker: ticker,
                quantity: holdings[ticker].quantity,
                price: holdings[ticker].price,
            });
        }
    }
    if (ret.totalValue > 0) {
        ret.yield = (ret.currentValue / ret.totalValue) - 1;
    }
    return ret;
};


export const getAllUsers = () => {
    return userRepository.findAll();
};

export const getAllTransactions = () => {
    return portfolioRepository.findAll();
};

export const getUserStatus = async (username) => {
    const portfolioStatus = await calcPortfolioStatus(username);
    const ret = {};
    ret.yield = portfolioStatus.yield;
    if (ret.yield > 0) {
        const comment = [
            '오늘 저녁은 소고기인가요?',
            '한강 물 온도 체크 안 해도 되겠네요!',
            '익절은 항상 옳습니다.',
            '계좌에 빨간 꽃이 피었습니다.',
            '이대로 화성까지 가즈아!'
        ];
        ret.mood = 'bull';
        ret.comment = comment[Math.floor(Math.random() * comment.length)];
    }
    else if (ret.yield < 0) {
        // random joke comment for loss in korean
        const comment = [
            '한강 물 따뜻한가요?',
            '파란색은 눈에 좋다고 하네요...',
            '괜찮아요, 주식은 원래 대응이니까요.',
            '강제 장기 투자자가 되신 걸 환영합니다.',
            '아직 안 팔았으면 손실 아닙니다.'
        ];
        ret.mood = 'bear';
        ret.comment = comment[Math.floor(Math.random() * comment.length)];
    }
    return ret;
};

export const getUserHistory = (username) => {
    return calcProfitHistory(username);
};

export const getUserPortfolioStatus = (username) => {
    return calcPortfolioStatus(username);
};

console.log(await getUserStatus('user2'))
