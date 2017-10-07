'use strict';

import Q from 'q';
import $ from 'jquery';

const handleResponseError = function(error) {
    switch(error.status) {
        case 401 : case 404 : throw new Error('NOT FOUND');
        default: throw new Error('NOT AVAILABLE');
    }
};

const select = ({ model='', attributes=[], order=[], where={} } = { }) => {
    return Q($.ajax({
        type: 'PUT',
        url: `/api/db/select/${model}?attributes=${attributes.join(',')}&order=${order.join(',')}`,
        dataType: 'json',
        data: where
    }))
    .catch(handleResponseError);
};

export default {
    select: select
};