import * as userRepository from './user.repository.js';

export const getAllUsers = () => {
    return userRepository.findAll();
};

export const getUserbyUsername = (username) => {
    return userRepository.findByUsername(username);
};

export const createUser = (username, name, password) => {
    return userRepository.create(username, name, password);
};

export const updateUser = (username, name, password) => {
    return userRepository.update(username, name, password);
};

export const deleteUser = (username, password) => {
    return userRepository.deleteByUsername(username, password);
};
