'use strict';

let express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    controllers = {
        test: require('../controllers/test.js'),
        db: require('../controllers/db.js')
    };



let apiRequestHandler = (req, res) => {
    let ctlName = req.params.controller;
    let ctlFunction = req.params.function;
    if (_.isNil(controllers[ctlName]) || !_.isFunction(controllers[ctlName][ctlFunction])) {
        res.sendStatus(500).end();
        return;
    }
    if (!_.isNil(req.params['0'])) {
        req.params = Object.assign({}, req.params, { arguments: req.params['0'].split('/') });
    }

    let query = {};
    req._parsedUrl.query.split('&').forEach((q) => {
        let parts = q.split('=');
        if (_.isNil(query[parts[0]])) query[parts[0]] = parts[1];
        else if (_.isArray(query[parts[0]])) query[parts[0]].push(parts[1]);
        else query[parts[0]] = [ query[parts[0]], parts[1] ];
    });

    req.params = Object.assign({}, req.params, { query: query });
    return controllers[ctlName][ctlFunction](req, res);
};


router.get('/', function (req, res) {
    res.render('index', {title: 'Main'});
});

router.get('/api/:controller/:function*', [], apiRequestHandler);
router.put('/api/:controller/:function*', [], apiRequestHandler);
router.post('/api/:controller/:function*', [], apiRequestHandler);
router.delete('/api/:controller/:function*', [], apiRequestHandler);

module.exports = router;
