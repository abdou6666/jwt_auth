const express = require('express');
const handleRefreshToken = require('../controllers/refreshTokenController');
const refreshRouter = express.Router();

refreshRouter.get('/', handleRefreshToken);

module.exports = refreshRouter;
