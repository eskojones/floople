'use strict';

let Q = require('q'),
    _ = require('lodash'),
    dbService = require('../services/db.js');

let dbAdaptor = {
    select: (req) => {
        let table = _.isNil(req.params.arguments) || req.params.arguments.length < 2 ? '' : req.params.arguments[1];
        let query = req.params.query;
        let attributes = _.isNil(query.attributes) ? [ ] : query.attributes.split(',');
        let order = _.isNil(query.order) ? [ ] : [ query.order.split(',') ];

        return {
            table: table,
            attributes: attributes,
            order: order,
            where: [ 'POST', 'PUT' ].includes(req.method) ? req.body : { }
        };
    },
    insert: (req) => {
        let table = _.isNil(req.params.arguments) || req.params.arguments.length < 2 ? '' : req.params.arguments[1];
        return {
            table: table,
            data: req.body
        };
    }
};

const select = (req, res) => {
    return dbService.select(dbAdaptor.select(req), req.user)
    .then( (rows) => {
        res.status(200).json(rows).end();
    })
    .catch( (error) => {
        res.status(200).json([ ]).end();
    });
};

const insert = (req, res) => {
    return dbService.insert(dbAdaptor.insert(req), req.user)
    .then( (result) => {
        res.status(200).json(result).end();
    })
    .catch( (error) => {
        res.status(200).json({ status: 'fail' }).end();
    });
};

module.exports = {
    select: select,
    insert: insert
};