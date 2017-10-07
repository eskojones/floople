'use strict';

let Q = require('q'),
    _ = require('lodash'),
    dbService = require('../services/db.js');

let dbAdaptor = {
    select: (req) => {
        let table = _.isNil(req.params.arguments) || req.params.arguments.length === 0 ? '' : req.params.arguments[1];
        let query = req.params.query;
        let attributes = _.isNil(query.attributes) ? [ ] : query.attributes.split(',');
        let order = _.isNil(query.order) ? [ ] : [ query.order.split(',') ];

        return {
            table: table,
            attributes: attributes,
            order: order,
            where: [ 'POST', 'PUT' ].includes(req.method) ? req.body : { }
        };
    }
};

const select = (req, res) => {
    return dbService.select(dbAdaptor.select(req), { username: 'guest' })
    .then( (rows) => {
        res.status(200).json(rows).end();
    });
};


module.exports = {
    select: select
};