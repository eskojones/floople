'use strict';

let Q = require('q'),
    _ = require('lodash'),
    models = require('../models');


let tables = {
    users: {
        model: models.User,
        attributes: [ 'username' ], //since we need username in the result in order to test access to password
        access: {
            password: (row, auth) => {
                return auth.username == row['username'] ? row['password'] : '[REDACTED]';
            }
        }
    }
};

const restrict = (query, rows, auth) => {
    let table = tables[query.table];
    let restricted = rows.slice();

    Object.keys(table.access).forEach((column) => {
        let idx = query.attributes.indexOf(column);
        if (idx > -1) {
            restricted.forEach( (row, idx) => {
                restricted[idx][column] = table.access[column](row, auth);
            });
        }
    });

    return restricted;
};

const select = (query, auth) => {
    let table = tables[query.table];
    //fail silently on invalid table to prevent information disclosure to attackers
    if (_.isNil(table)) {
        return Q.fcall(() => { return []; });
    }
    let attributes = _.union(table.attributes, query.attributes);

    return table.model.findAll({
        attributes: attributes,
        order: query.order,
        where: query.where
    })
    .then( (rows) => {
        if (_.isNil(rows)) {
            return Q.fcall(() => { return []; });
        }

        return restrict(query, rows, auth);
    })
    .catch( (error) => {
        console.log('[dbService.select]', error);
        return [];
    });
};


module.exports = {
    select: select
};