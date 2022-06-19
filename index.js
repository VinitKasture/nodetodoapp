require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect(process.env.MONGODB_URL, () => { console.log('Database Connected') });

const app = express();

// EJS
app.use(cookieParser())
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.json());

//routes
app.use(require('./routes/index'))
app.use(require('./routes/users'))
app.use(require('./routes/quizz'))
app.use(require('./routes/todos'))

// Express body parser
app.use(express.urlencoded({ extended: true }));

//Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


// //Connect Flash
// app.use(flash());

// //Global Vars
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.warning_msg = req.flash('warning_msg');
// })

//Routes
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/todos'));


app.listen(3000, () => { console.log('Listening'); })