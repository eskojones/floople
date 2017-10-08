'use strict';

let express = require('express'),
    router = express.Router(),
    _ = require('lodash'),
    controllers = {
        test: require('../controllers/test.js'),
        db: require('../controllers/db.js'),
        auth: require('../controllers/auth.js')
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
    if (!_.isNil(req._parsedUrl.query)) {
        req._parsedUrl.query.split('&').forEach((q) => {
            let parts = q.split('=');
            if (_.isNil(query[parts[0]])) query[parts[0]] = parts[1];
            else if (_.isArray(query[parts[0]])) query[parts[0]].push(parts[1]);
            else query[parts[0]] = [ query[parts[0]], parts[1] ];
        });
    }

    req.params = Object.assign({}, req.params, { query: query });
    return controllers[ctlName][ctlFunction](req, res);
};

let renderApp = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.message = 'You need to be logged in to view this page';
        res.redirect('/login');
        return;
    }
    res.render('app', { title: 'App' });
};

router.get('/', (req, res) => {
    res.render('site', { title: 'Site' });
});

router.get('/app', renderApp);

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/api/:controller/:function*', [], apiRequestHandler);
router.put('/api/:controller/:function*', [], apiRequestHandler);
router.post('/api/:controller/:function*', [], apiRequestHandler);
router.delete('/api/:controller/:function*', [], apiRequestHandler);

module.exports = router;
