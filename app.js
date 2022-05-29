const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./config/database');

const mysql2 = require('mysql2/promise'); 

const flash = require('connect-flash');


require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.json());

// const options = {                 // setting connection options
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
// };

// var connection = mysql2.createPool(options);
// var sessionStore = new MySQLStore({}, connection);

app.use(session({

    secret: process.env.SECRET01,
    resave: false, 
    saveUninitialized: false,
    // store:sessionStore

}));

app.use(flash());


//global var
app.use((req, res, next) => {

    res.locals.login_error = req.flash('error');

    next();
});

require('./config/passport')(passport);

app.use(passport.authenticate('session'));

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/svg', express.static('public/svg'));
// app.use('/messages', express.static('views/messages'));
app.use('/trumbowyg', express.static('public/trumbo'))

// app.use('/', function(req, res, next) {
//     // req.session.count = 1;
//     console.log(req.session);
//     next()
// });

app.use('/', require('./routes/routes'));

app.listen(3000);