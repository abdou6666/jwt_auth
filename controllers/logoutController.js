const usersDB = {
	users: require('../model/users.json'),
	setUsers: function(data) {
		this.users = data;
	}
};
const jwt = require('jsonwebtoken');
require('dotenv').config();
const promises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
	const cookies = req.cookies;

	// if (!cookies?.jwt) return res.sendStatus(204);
	if (!cookies.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	// is refresh token in db
	const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);

	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
		return res.sendStatus(204);
	}

	// Delete refresh token in db
	const otherUsers = usersDB.users.filter((user) => user.refreshToken !== foundUser.refreshToken);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([ ...otherUsers, currentUser ]);

	await promises.writeFile(
		path.join(__dirname, '..', 'model', 'users.json'),
		JSON.stringify(usersDB.users)
	);
	res.clearCookie('jwt', {
		httpOnly: true,
		sameSite: 'none',
		secure: true
	}); // secure : true - only serves https
	res.sendStatus(204);
};

module.exports = handleLogout;
