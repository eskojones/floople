'use strict';

import Q from 'q';
import $ from 'jquery';

const apiEndpoint = '/api/auth';

const handleResponseError = function(error) {
    switch(error.status) {
        case 401 : case 404 : throw new Error('NOT FOUND');
        default: throw new Error('NOT AVAILABLE');
    }
};

const login = ({ username='', password='' } = {}) => {
    return Q($.ajax({
        type: 'PUT',
        url: `${apiEndpoint}/login`,
        dataType: 'json',
        data: {
            username: username,
            password: password
        }
    }))
    .catch(handleResponseError);
};

export default {
    login: login
};