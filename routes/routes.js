const express = require('express');
const route = express.Router();

const main = require('../controllers/main');

route.get('/', main.home);
route.get('/home', main.home);

route.get('/page:num', main.next);
route.get('/home/page:page', main.next);

route.get('/content:name', main.content)

module.exports = route;