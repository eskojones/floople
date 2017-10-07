'use strict';

require('../config/passport.js');

const db = require('./config/db.js'),
      routes = require('./routes/index.js'),
      config = require('../config/app.json'),
      logger = require('morgan'),
      express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      bodyParser = require('body-parser'),
      expressSanitized = require('express-sanitized'),
      helmet = require('helmet'),
      sassMiddleware = require('node-sass-middleware'),
      session = require('express-session'),
      passport = require('passport'),
      neat = require('node-neat'),
      app = express(),
      compress = require('compression'),
      SequelizeSessionStore = require('connect-session-sequelize')(session.Store),
      sessionStore = new SequelizeSessionStore({ db: db }),
      ejs = require('ejs');

sessionStore.sync();
app.use(compress());
app.set('views', path.join(__dirname, '../frontend/views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(favicon(path.join(__dirname, '../frontend/public', 'images', 'favicon.ico')));
app.use(helmet());
app.use(logger(config.logFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitized());
app.use(session({
    secret: config.session.secret,
    store: sessionStore,
    proxy: config.session.proxy,
    resave: false,
    saveUninitialized: false,
    cookie: { domain: config.session.domain, secure: config.session.secureCookie }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(sassMiddleware({
    src: path.join(__dirname, '../frontend/public'),
    dest: path.join(__dirname, '../frontend/public'),
    debug: true,
    outputStyle: 'compressed',
    includePaths: neat.includePaths
}), express.static(path.join(__dirname, '../frontend/public')));

app.use('/', routes);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    require('./lib/logger.js').warn('[general-error]', {error: error.stack});
    //res.status(error.status || 500);
    //res.render('error');
    next(error);
});

module.exports = app;