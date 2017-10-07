'use strict';

let Q = require('q');


const func = (method, req, res) => {
    return Q.fcall(() => {
        res.status(200).json(req.params).end();
    });
};


module.exports = {
    func: func
};