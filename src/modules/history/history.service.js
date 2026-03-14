import * as historyRepository from './history.repository.js'
import * as chartService from '../chart/chart.service.js';

export const getHistoryByUsername = async (username) => {
    return chartService.calcHistory(username);
};

export const createHistory = (username, date, principal, valuation) => {
    return historyRepository.create(username, date, principal, valuation);
};

export const updateHistory = (username, date, principal, valuation) => {
    return historyRepository.update(username, date, principal, valuation);
};

export const deleteHistoryByDate = (username, date) => {
    return historyRepository.deleteByDate(username, date);
};
