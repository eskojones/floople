'use strict';

let Q = require('q'),
    passport = require('passport');

const login = (req, res) => {
    if (req.method !== 'PUT') {
        return Q.fcall(() => { 
            console.log('authService.login: Invalid HTTP method.');
            res.redirect('/login');
        });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            res.status(200).json({ status: 'error' }).end();
            return;
        }

        req.logIn(user, function (err) {
            if (err) {
                res.status(200).json({ status: 'error' }).end();
                return;
            }

            res.req.authenticated = true;

            req.session.save(() => {
                res.status(200).json(user).end();
            });
        });
    })(req, res);
};

module.exports = {
    login: login
};