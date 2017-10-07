'use strict';

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, () => {
    //auth function here :)
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done();
});
