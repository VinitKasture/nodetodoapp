const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

//User Model
const User = require('../models/User');

//jwt authentication
const { createTokens } = require('../config/jwt');

//signup handle
router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async(req, res) => {
    const { name, email, username, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !username || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password Should be at least 8 characters' });
    }

    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
        errors.push({ msg: 'Username is already taken!' });
    }

    if (errors.length > 0) {
        res.render('signup', { errors, name, email, username, password, password2 })
    } else {
        const newUser = new User({
            name,
            email,
            username,
            password
        })
        User.findOne({ email }).then((user) => {
            if (user) {
                errors.push({ msg: 'Email is already registered!' })
                res.render('signup', { errors, name, email, username, password, password2 })
            } else {
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (error) throw error;
                        newUser.password = hash;
                        newUser.save()
                        res.redirect('/users/login')
                    })
                })
            }
        })
    }
})

//login handle
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    let errors = []
    if (!email || !password) {
        errors.push({ msg: "Invalid Credentials!" })
    }
    if (errors.length > 0) {
        res.render('login', { errors });
    } else {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                errors.push({ msg: "Email is not registered!" })
                res.render('login', { errors })
            } else {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    errors.push({ msg: "Invalid Password!" })
                    res.render('login', { errors })
                } else {
                    const accessToken = createTokens(user)
                    res.cookie("accessToken", accessToken, { httpOnly: true });
                    res.cookie("name", user.name, { httpOnly: true });
                    res.cookie("email", user.email, { httpOnly: true });
                    res.redirect('/dashboard')
                }
            }
        } catch (err) {
            if (err) throw err;
        }
    }

})

router.get('/logout', (req, res) => {
    res.clearCookie("accessToken", "email", "name");
    res.clearCookie("email");
    res.clearCookie("name");
    res.redirect('/users/login')
})

module.exports = router;