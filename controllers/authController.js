const path = require('path');
const promises = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const userDB = {
	users: require('../model/users.json'),
	setUsers: function(data) {
		this.users = data;
	}
};

const handleLogin = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ error: 'Username and password required !' });
	const foundUser = userDB.users.find((user) => user.username === username);
	if (!foundUser) {
		return res.status(401).json({ error: 'credentials are wrong !' });
	}
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		// expiresIn should be 15m
		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: '30s'
			}
		);

		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// Saving refreshToken with current user
		const otherUsers = userDB.users.filter((person) => person.username !== foundUser.username);
		const currentUser = { ...foundUser, refreshToken };
		userDB.setUsers([ ...otherUsers, currentUser ]);
		await promises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(userDB.users)
		);
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000
		});

		return res.json({ accessToken });
	} else {
		return res.sendStatus(401);
	}
};

module.exports = { handleLogin };
