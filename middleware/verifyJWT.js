const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.status(401);
	const token = authHeader.split(' ')[1]; // bearer token

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		// unauthorized
		if (err) return res.sendStatus(403);

		req.user = decoded.username;
		console.log(req.user);
		next();
	});
};

module.exports = verifyJWT;
