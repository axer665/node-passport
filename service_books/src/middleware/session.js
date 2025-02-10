const session = require('express-session');
module.exports = () => (
    session({
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: null,
        },
        name: 'Library-session',

        secret: process.env.COOKIE_SECRET || 'Library-secret',

        // @see https://github.com/expressjs/session#resave
        resave: false,

        // @see https://github.com/expressjs/session#saveuninitialized
        saveUninitialized: false
    })
);