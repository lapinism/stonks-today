import * as historyRepository from '../history/history.repository.js'
import * as portfolioRepository from '../portfolio/portfolio.repository.js';

const cache = new Map();
let lastUpdate = new Date().toISOString().slice(0, 10);

export const fetchChartData = async (ticker) => {
    if (lastUpdate !== new Date().toISOString().slice(0, 10)) {
        cache.clear();
    }
    lastUpdate = new Date().toISOString().slice(0, 10);

    const now = Date.now();
    const cached = cache.get(ticker);

    if (cached && cached.expire > now) {
        return cached.value;
    }

    const ret = {};

    if (isNaN(ticker)) {
        const data = await fetch(`${process.env.US_STOCK_API_URL}/${!isNaN(ticker) ? ticker + '.KS' : ticker}?interval=1d&range=2mo`);
        const json = await data.json();

        const timestamp = json.chart.result[0].timestamp;
        const close = json.chart.result[0].indicators.quote[0].close;

        const rateData = await fetch(`${process.env.USD_TO_KRW_API_URL}`);
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

        const data = await fetch(`${process.env.KR_STOCK_API_URL}?symbol=${ticker}&requestType=1&startTime=${dateStr}&endTime=99999999&timeframe=day`);
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

    cache.set(ticker, {
        value: ret,
        expire: now + 1000 * 60 * 1
    });

    return ret;
};

export const calcHistory = async (username) => {
    const history = historyRepository.findByUsername(username);
    const portfolio  = portfolioRepository.findByUsername(username);
    const chartData = {};
    let principal = 0;
    
    const tickers = [...new Set(portfolio.map(tx => tx.ticker))];
    const chartDataList = await Promise.all(tickers.map(ticker => fetchChartData(ticker)));
    
    tickers.forEach((ticker, index) => {
        chartData[ticker] = chartDataList[index];
    });

    for (const tx of portfolio) {
        principal += tx.quantity * tx.price;
    }

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const threshold = new Date();
    threshold.setDate(today.getDate() - 31);

    // delete old history data in db
    historyRepository.deleteByDate(username, '0000-00-00', threshold.toISOString().slice(0, 10));

    let ret = [];
    let currentTxsIdx = 0;
    for (let i = 0; i <= 30; i++) {
        const currentDate = new Date(thirtyDaysAgo);
        currentDate.setDate(thirtyDaysAgo.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        const existingHistory = history.find(h => h.date === dateStr);
        if (existingHistory) {
            ret.push(existingHistory.valuation - existingHistory.principal);
        }
        else {
            let valuation = 0;
            for (const tx of portfolio) {
                valuation += tx.quantity * chartData[tx.ticker][dateStr];
            }
            if (i < 30) {
                historyRepository.create(username, dateStr, principal, valuation);
            }
            ret.push(valuation - principal);
        }
    }

    return ret;
};

export const calcTodayYield = async (username) => {
    const portfolio  = portfolioRepository.findByUsername(username);
    let principal = 0;
    let valuation = 0;
    for (const tx of portfolio) {
        const chartData = await fetchChartData(tx.ticker);
        principal += tx.quantity * tx.price;
        valuation += tx.quantity * chartData[new Date().toISOString().slice(0,10)];
    }
    return principal > 0 ? (valuation - principal) / principal : 0;
};
