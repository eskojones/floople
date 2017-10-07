'use strict';

let Q = require('q');


const login = (req, res) => {
    return Q.fcall(() => {
        res.status(200).json(req.params).end();
    });
};


module.exports = {
    login: login
};