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
        if ([ 'POST', 'PUT' ].includes(req.method)) {
            return {
                table: table,
                data: req.body
            };
        }
        return { };
    },
    delete: (req) => {
        let table = _.isNil(req.params.arguments) || req.params.arguments.length < 2 ? '' : req.params.arguments[1];
        if ([ 'POST', 'PUT' ].includes(req.method)) {
            return {
                table: table,
                where: req.body
            };
        }
        return { };
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

const _delete = (req, res) => {
    return dbService.delete(dbAdaptor.delete(req), req.user)
    .then( (rowsAffected) => {
        res.status(200).json(rowsAffected).end();
    })
    .catch( (error) => {
        res.status(200).json(0).end();
    });
};

module.exports = {
    select: select,
    insert: insert,
    delete: _delete
};