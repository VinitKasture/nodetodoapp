const jwt = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = jwt.sign({ name: user.name, id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        res.redirect('/users/login')
    }
    try {
        const validToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.redirect('/users/login')
                return false
            }
            next();
        });
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (error) {
        console.log('[jwt.js].validateToken catch error');
    }
};

module.exports = { createTokens, validateToken };