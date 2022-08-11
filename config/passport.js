const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email'}, (email, password, done) =>{
            //Match User
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: 'That Email is not registered.'});
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: 'Password is incorrect'});

                        }
                    })
                })
                .catch(err => console.log (err)); 
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((user, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}