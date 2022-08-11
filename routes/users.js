const { response } = require('express');
const express = require('express');
const router = express.router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register Handler
route.post('/register', (req, res) => {
    const {name, email, password, password2 } = req.body;
    let errors = [];

    //Check Required Fields
    if (!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }

    //Check Password Fields Match
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    //Check Password Length
    if (password.length < 6) {
        errors.push({msg: 'Password must be at least 6 characters'})
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        User.findOne( {email: email })
            .then(user => {
                if(user){
                    //User Exists
                    errors.push ({ msg: 'Email already in use' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User( {
                        name,
                        email,
                        password,
                    })
                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Set Password to Hashed
                            newUser.password = hash;
                            //Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can now login')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));


                    }))
                }
            })

    }
})

// Login Handler
router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

//Logout Handler
router.get('/users/logout', (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login')
})

module.exports = router;