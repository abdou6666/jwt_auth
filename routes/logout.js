const express = require('express');
const handleLogout = require('../controllers/logoutController');
const logoutRouter = express.Router();

logoutRouter.get('/', handleLogout);

module.exports = logoutRouter;
