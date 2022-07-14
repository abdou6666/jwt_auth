const jwt = require('jsonwebtoken');
const path = require('path');
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader.startsWith('Bearer ')) return res.status(401);
	const token = authHeader.split(' ')[1]; // bearer token

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		// unauthorized
		if (err) return res.sendStatus(403);

		req.user = decoded.userInfo.username;
		req.roles = decoded.userInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
