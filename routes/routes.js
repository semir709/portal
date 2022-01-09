const express = require('express');
const route = express.Router();

const main = require('../controllers/main');

route.get('/', main.home);
route.get('/home', main.home);

route.get('/:page', main.next);
route.get('/home:page', main.next);

module.exports = route;