const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../model/user');
const wrapAsync = require('../utilities/wrapAsync')
const {storeReturnTo} = require('../middleware')
const users = require('../controllers/users')

router.get('/register', users.registerForm)

router.post('/register', wrapAsync(users.registerUser));


router.get('/login', users.loginRoute)

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), users.loginUser)


router.get('/logout', users.logoutUser);
module.exports = router;





