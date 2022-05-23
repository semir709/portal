const express = require('express');
const session = require('express-session');
const passport = require('passport');


require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({

    secret: process.env.SECRET01,
    resave: true, 
    saveUninitialized: true

}));

require('./config/passport')(passport);

app.use(passport.authenticate('session'));

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/svg', express.static('public/svg'));
app.use('/trumbowyg', express.static('public/trumbo'))

app.use('/', require('./routes/routes'));

app.listen(3000);