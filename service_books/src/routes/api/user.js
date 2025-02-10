const express = require('express');
const passport = require('passport');
const router = express.Router();
const repository = require('../../repositories');

router.post('/login',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/user/login',
            successRedirect : '/user/me',
        },
    ),
    (req, res) => {
        console.log("req.user: ", req.user);
        res.redirect('/user/me');
    });

router.get('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

router.post('/signup',
    async (req, res) => {
        const { userName, password, repeatPassword } = req.body;
        if(userName && password && password === repeatPassword) {
            await repository.users.addUser({
                userName,
                password,
            });
            res.redirect('/user/login');
        } else {
            res.redirect('/user/signup');
        }
    });

module.exports = router;