const express = require("express");
const router = express.Router();

const User = require('../models/User')

//Validate Middleware
const { validateToken } = require('../config/jwt');

router.get("/dashboard", validateToken, async(req, res) => {
    let name = req.cookies["name"];
    const email = req.cookies["email"];
    const user = await User.findOne({ email });
    const todos = user.todos;
    res.render('dashboard', { name, todos });
});

module.exports = router;