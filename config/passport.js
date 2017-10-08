'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      dbService = require('../backend/services/db.js');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true
}, (username, password, passportHandler) => {
    return dbService.select({
        table: 'users',
        where: {
            username: username
        }
    }, { username: username })
    .then( (result) => {
        if (!_.isArray(result) || result.length == 0) {
            passportHandler(null, { status: 'Username not found' });
            return;
        }

        //TODO: bcrypt.compareSync()
        if (result[0].password !== password) {
            return passportHandler(null, { status: 'Invalid password' });
            return;
        }

        let user = Object.assign({}, result[0].dataValues, { status: 'Success' });
        return passportHandler(null, user);
    })
    .catch( (error) => {
        console.error(`passport: ${error}`);
        return passportHandler(null, { status: 'Unknown error occured' });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    dbService.select({
        table: 'users',
        where: {
            id: id
        }
    })
    .then( (users) => {
        if (!_.isArray(users) || users.length == 0) {
            console.log(`passport.deserializeUser: dbService returned no users`);
            done(null, { });
            return;
        }

        done(null, users[0].dataValues);
    })
    .catch( (error) => {
        console.error(`passport.deserializeUser: ${error}`);
    });
});
