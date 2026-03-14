import * as portfolioRepository from '../portfolio/portfolio.repository.js';
import * as userRepository from '../user/user.repository.js';

export const addUser = (data) => {
    userRepository.create(data.username, data.name, data.userpw);
    console.log(`New user added`);
    data.userpw = '********';
    data.password = '********';
    console.log(data)
};

export const addTransaction = (data) => {
    portfolioRepository.create(data.username, data.ticker, data.quantity, data.price);
    console.log(`New transaction added`);
    data.password = '********';
    console.log(data);
};
