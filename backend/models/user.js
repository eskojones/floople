'use strict';

const bcrypt = require('bcryptjs'),
      uuid = require('node-uuid'),
      logger = require('../lib/logger.js');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('User', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        username: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING },
        type: { type: DataTypes.STRING, defaultValue: 'user' }
    }, {
        freezeTableName: true,
        paranoid: false,
        timestamps: false,
        classMethods: {
            associate: (models) => {
            }
        },
        instanceMethods: {
        }
    });

    User.hook('beforeCreate', (userAccount) => {
        let hash = bcrypt.hashSync(userAccount.password);
        userAccount.password = hash;
    });

    User.hook('beforeUpdate', (userAccount) => {
        if (userAccount.changed('password')) {
            let hash = bcrypt.hashSync(userAccount.password);
            userAccount.password = hash;
        }
    });

    return User;
};