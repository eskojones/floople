'use strict';

import Q from 'q';
import $ from 'jquery';
import _ from 'lodash';

const apiEndpoint = '/api/db';

const handleResponseError = function(error) {
    switch(error.status) {
        case 401 : case 404 : throw new Error('NOT FOUND');
        default: throw new Error('NOT AVAILABLE');
    }
};

const select = ({ model='', attributes=[], order=[], where={} } = { }) => {
    if (!_.isString(model) || model.length == '' || !_.isArray(attributes) || attributes.length == 0) {
        return Q.fcall( () => { return []; });
    }

    let orderString = _.isArray(order) && order.length == 2 ? `&order=${order.join(',')}` : '';
    let queryString = `?attributes=${attributes.join(',')}${orderString}`;

    return Q($.ajax({
        type: 'PUT',
        url: `${apiEndpoint}/select/${model}${queryString}`,
        dataType: 'json',
        data: _.isObject(where) ? where : { }
    }))
    .catch(handleResponseError);
};

const insert = ({ model='', data={} } = { }) => {
    return Q($.ajax({
        type: 'PUT',
        url: `${apiEndpoint}/insert/${model}`,
        dataType: 'json',
        data: _.isObject(data) ? data : { }
    }))
    .catch(handleResponseError);
};

const _delete = ({ model='', where={} } = { }) => {
    return Q($.ajax({
        type: 'PUT',
        url: `${apiEndpoint}/delete/${model}`,
        dataType: 'json',
        data: _.isObject(where) ? where : { }
    }))
    .catch(handleResponseError);
};

export default {
    select: select,
    insert: insert,
    delete: _delete
};