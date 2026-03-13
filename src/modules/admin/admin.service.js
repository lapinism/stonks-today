import * as transactionRepository from '../transaction/transaction.repository.js';
import * as userRepository from '../user/user.repository.js';

export const addUser = (data) => {
    userRepository.add(data);
    console.log(`New user added`);
    data.password = '********';
    console.log(data)
};

export const addTransaction = (data) => {
    transactionRepository.add(data);
    console.log(`New transaction added`);
    data.password = '********';
    console.log(data);
};
