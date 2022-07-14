const User = require('../model/User');

const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
	const cookies = req.cookies;

	// if (!cookies?.jwt) return res.sendStatus(204);
	if (!cookies.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	// is refresh token in db
	const foundUser = await User.findOne({ refreshToken }).exec();

	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
		return res.sendStatus(204);
	}

	// Delete refresh token in db
	foundUser.refreshToken = '';
	await foundUser.save();

	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'none',
		secure: true
	}); // secure : true - only serves https
	res.sendStatus(204);
};

module.exports = handleLogout;
