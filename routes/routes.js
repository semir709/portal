const express = require('express');
const route = express.Router();

const main = require('../controllers/main');
const admin = require('../controllers/admin');

route.get('/', main.home);
route.get('/home', main.home);

route.get('/page:num', main.next);
route.get('/home/page:page', main.next);

route.get('/content:name', main.content)

route.get('/about', main.about);

route.get('/login', admin.login);
route.get('/admin:name', admin.home);

module.exports = route;