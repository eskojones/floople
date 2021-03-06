'use strict';

let Q = require('q'),
    _ = require('lodash'),
    models = require('../models');


let tables = {
    users: {
        model: models.User,
        attributes: [ 'username' ], //since we need username in the result in order to test access to password
        select: {
            password: (row, auth) => {
                return auth.username == row['username'] ? row['password'] : '[REDACTED]';
            }
        },
        insert: (query, auth) => {
            return !_.isNil(auth.username);
        },
        delete: (query, auth) => {
            return !_.isNil(auth.username);
        }
    }
};

const restrict = (query, rows, auth) => {
    let table = tables[query.table];
    let restricted = rows.slice();

    Object.keys(table.select).forEach((column) => {
        let idx = query.attributes.indexOf(column);
        if (idx > -1) {
            restricted.forEach( (row, idx) => {
                restricted[idx][column] = table.select[column](row, auth);
            });
        }
    });

    return restricted;
};

const select = (query, auth) => {
    if (!_.isObject(auth)) {
        auth = {
            username: ''
        };
    }

    let table = tables[query.table];

    if (_.isNil(table)) {
        return Q.fcall(() => { return []; });
    }

    let attributes = _.union(table.attributes, 
                             _.isNil(query.attributes) || query.attributes.length == 0 
                                ? Object.keys(table.model.rawAttributes)
                                : query.attributes
                            );

    query.attributes = attributes;

    let findObject = {
        order: query.order,
        where: query.where,
        attributes: attributes
    };

    return table.model.findAll(findObject)
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

const insert = (query, auth) => {
    if (!_.isObject(auth)) {
        auth = {
            username: ''
        };
    }

    let table = tables[query.table];

    if (_.isNil(table) || !table.insert(query, auth)) {
        return Q.fcall(() => { return { status: 'fail' }; });
    }

    return table.model.create(query.data)
    .then( (row) => {
        if (_.isNil(row)) {
            return Q.fcall(() => { return { status: 'fail' }; });
        }

        return Object.assign({}, row, { status: 'success' });
    })
    .catch( (error) => {
        console.log('[dbService.insert]', error);
        return { status: 'fail' };
    })
};

const _delete = (query, auth) => {
    if (!_.isObject(auth)) {
        auth = {
            username: ''
        };
    }

    let table = tables[query.table];

    if (_.isNil(table) || _.isNil(query.where) || !table.delete(query, auth)) {
        return Q.fcall(() => { return 0; });
    }

    return table.model.destroy({ where: query.where })
    .then( (rowsAffected) => {
        return rowsAffected;
    })
    .catch( (error) => {
        console.log('[dbService.delete]', error);
        return 0;
    })
};

module.exports = {
    select: select,
    insert: insert,
    delete: _delete
};