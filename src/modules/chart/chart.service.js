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
    const cacheKey = `${ticker}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expire > now) {
        return cached.value;
    }

    const ret = {};

    if (isNaN(ticker)) {
        const data = await fetch(`${process.env.US_STOCK_API_URL}/${!isNaN(ticker) ? ticker + '.KS' : ticker}?interval=1d&range=2y`);
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
        const queryDate = new Date();
        queryDate.setMonth(currentDate.getMonth() - 24 - 1);
        const dateStr = queryDate.toISOString().slice(0,10).replace(/-/g, '');

        const data = await fetch(`${process.env.KR_STOCK_API_URL}?symbol=${ticker}&requestType=1&startTime=${dateStr}&endTime=99999999&timeframe=day`);
        const text = await data.text();
        const json = JSON.parse(text.replace(/'/g, '"'))

        for (let i = 1; i < json.length; i++) {
            ret[json[i][0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")] = json[i][4];
        }
    }

    const fillDays = 24 * 31 + 10;
    const endDate = new Date();
    let iterDate = new Date();
    iterDate.setDate(endDate.getDate() - fillDays);

    while (iterDate <= endDate) {
        const dateStr = iterDate.toISOString().slice(0, 10);
        if (!ret[dateStr]) {
            const prevDate = new Date(iterDate);
            prevDate.setDate(iterDate.getDate() - 1);
            ret[dateStr] = ret[prevDate.toISOString().slice(0, 10)];
        }
        iterDate.setDate(iterDate.getDate() + 1);
    }

    cache.set(cacheKey, {
        value: ret,
        expire: now + 1000 * 60 * 1
    });

    return ret;
};

export const calcHistory = async (username, period = 1) => {
    const months = parseInt(period) || 1;
    const history = historyRepository.findByUsername(username);
    const portfolio  = portfolioRepository.findByUsername(username);
    const chartData = {};
    let principal = 0;
    
    const tickers = [...new Set(portfolio.map(tx => tx.ticker))];
    const chartDataList = await Promise.all(tickers.map(ticker => fetchChartData(ticker, months)));
    
    tickers.forEach((ticker, index) => {
        chartData[ticker] = chartDataList[index];
    });

    for (const tx of portfolio) {
        principal += tx.quantity * tx.price;
    }

    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const threshold = new Date(startDate);
    threshold.setMonth(today.getMonth() - 12);
    threshold.setDate(threshold.getDate() - 1);

    // delete old history data in db
    historyRepository.deleteByDate(username, '0000-00-00', threshold.toISOString().slice(0, 10));

    let ret = [];
    let iterDate = new Date(startDate);
    const todayStr = today.toISOString().slice(0, 10);

    while (iterDate <= today) {
        const dateStr = iterDate.toISOString().slice(0, 10);
        const existingHistory = history.find(h => h.date === dateStr);

        if (existingHistory) {
            ret.push(existingHistory.principal > 0 ? (existingHistory.valuation - existingHistory.principal) / existingHistory.principal : 0);
        }
        else {
            let valuation = 0;
            for (const tx of portfolio) {
                const priceAtDate = chartData[tx.ticker][dateStr];
                if (priceAtDate === undefined || priceAtDate === null) {
                    console.warn(`Price data missing for ${tx.ticker} on ${dateStr}. Using portfolio price: ${tx.price}`);
                    valuation += tx.quantity * tx.price;
                }
                else {
                    valuation += tx.quantity * priceAtDate;
                }
            }
            if (dateStr !== todayStr) {
                historyRepository.create(username, dateStr, principal, valuation);
            }
            ret.push(principal > 0 ? (valuation - principal) / principal : 0);
        }
        iterDate.setDate(iterDate.getDate() + 1);
    }

    return ret;
};

export const calcTodayYield = async (username) => {
    const portfolio  = portfolioRepository.findByUsername(username);
    let principal = 0;
    let valuation = 0;
    const todayStr = new Date().toISOString().slice(0, 10);

    for (const tx of portfolio) {
        const chartData = await fetchChartData(tx.ticker);
        principal += tx.quantity * tx.price;

        const priceToday = chartData[todayStr];
        if (priceToday === undefined || priceToday === null) {
            console.warn(`Price data missing for ${tx.ticker} on ${todayStr}. Using portfolio price: ${tx.price}`);
            valuation += tx.quantity * tx.price;
        } else {
            valuation += tx.quantity * priceToday;
        }
    }
    return principal > 0 ? (valuation - principal) / principal : 0;
};
