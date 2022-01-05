const express = require('express');
const route = express.Router();

const main = require('../controllers/main');

route.get('/', main.home);

module.exports = route;