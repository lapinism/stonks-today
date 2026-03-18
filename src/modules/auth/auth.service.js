import * as userRepository from '../user/user.repository.js';

export const tryLogin = (req, res, next) => {
    const username = req.params.username;
    const password = req.body.password;
    if (userRepository.findByPassword(username, password)) {
        req.session.username = username;
    }
    next();
};

export const isAuthenticated = (req, res, next) => {
    if (req.session.username !== req.params.username) {
        res.redirect(`/${req.params.username}/login`);
        return;
    }
    next();
};
