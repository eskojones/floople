'use strict';

let Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/db.json')[env];
let cls = require('continuation-local-storage');
Sequelize.useCLS(cls.createNamespace(config.namespace));
//var connection = new Sequelize(config.database, config.username, config.password, config);
var connection = null;

module.exports = connection;