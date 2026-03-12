import * as userRepository from './user.repository.js';

export const getAllUsers = () => {
    return userRepository.findAll();
};

export const getUserbyUsername = (username) => {
    return userRepository.findByUsername(username);
};
