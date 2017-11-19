const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');
const User = mongoose.model('Users');

require('../models/Idea');
const Idea = mongoose.model('Ideas');
//User login route
router.get('/login',(req,res) =>{
    res.render('../views/users/login');
})

//login form post
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req,res,next);
})

//User Registration
router.get('/register',(req,res) => {
    res.render('../views/users/register');
})

router.post('/register',(req,res)=>{
    const errors = [];
    if(req.body.password != req.body.password2) {
        errors.push({text:'Passwords do not match'});
    }
    if(req.body.password.length < 5) {
        errors.push({text:'Password must be at least 5 characters'});
    }
    if(errors.length > 0){
        res.render('../views/users/register', {
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2:req.body.password2
        })
    } else {
        User.findOne({email:req.body.email})
        .then(user => {
            if(user) {
                req.flash('error_msg','This email is already registered.');
                res.redirect('/users/register');
            } else {
                const newUser = new User({
            name: req.body.name,
            email:req.body.email,
            password:req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password,salt,(err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    req.flash('success_msg',"You are now registered.");
                    res.redirect('/users/login');
                })
                .catch(err => {
                    console.log(err);
                    return;
                })
            });

        });
            }
        })
        
    }
})

router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg', 'You logged off.');
    res.redirect('/users/login');

})

module.exports = router;