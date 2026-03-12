import * as portfolioRepository from '../transaction/transaction.repository.js';
import * as userRepository from '../user/user.repository.js';

const calcProfitHistory = (username) => {
    let transactions = portfolioRepository.findByUsername(username);
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let holdings = {}; // { ticker: { quantity, price } }

    const prePeriodTxs = transactions.filter(transaction => new Date(transaction.date) < thirtyDaysAgo);
    const periodTxs = transactions.filter(transaction => new Date(transaction.date) >= thirtyDaysAgo);

    const updateHoldings = (transaction) => {
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

    prePeriodTxs.forEach(updateHoldings);

    let ret = [];
    let currentTxsIdx = 0;
    for (let i = 0; i <= 30; i++) {
        const currentDate = new Date(thirtyDaysAgo);
        currentDate.setDate(thirtyDaysAgo.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        while (currentTxsIdx < periodTxs.length && periodTxs[currentTxsIdx].date === dateStr) {
            updateHoldings(periodTxs[currentTxsIdx]);
            currentTxsIdx++;
        }

        let totalCost = 0;
        let currentVal = 0;
        for (const ticker in holdings) {
            if (holdings[ticker].quantity > 0) {
                totalCost += holdings[ticker].price;
                currentVal += holdings[ticker].price * (Math.random() * 2.0);
            }
        }

        const dailyYield = totalCost === 0 ? 1 : ((currentVal / totalCost) - 1);
        ret.push(parseFloat(dailyYield.toFixed(2)));
    }

    return ret;
};

const calcPortfolioStatus = (username) => {
    let holdings = {};
    for (const transaction of portfolioRepository.findByUsername(username)) {
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
    }
    let ret = [];
    for (const ticker in holdings) {
        console.log(ticker);
        // TODO: calc delta with live value, and then total status
        if (holdings[ticker].quantity > 0) {
            ret.push({
                ticker: ticker,
                quantity: holdings[ticker].quantity,
                price: holdings[ticker].price,
            });
        }
    }
    return ret;
};



export const getAllUsers = () => {
    return userRepository.findAll();
};

export const getAllTransactions = () => {
    return portfolioRepository.findAll();
};

export const getUserStatus = (username) => {
    return calcProfitStatus();
};

export const getUserHistory = (username) => {
    return calcProfitHistory(username);
};

export const getUserPortfolioStatus = (username) => {
    return calcPortfolioStatus(username);
};
