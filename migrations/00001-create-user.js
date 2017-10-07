'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('User', {
            id: { type: Sequelize.UUID, primaryKey: true },
            username: { type: Sequelize.STRING },
            password: { type: Sequelize.STRING },
            type: { type: Sequelize.STRING, defaultValue: 'user' }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('User');
    }
};