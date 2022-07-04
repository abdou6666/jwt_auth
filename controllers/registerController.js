const path = require('path');
const promises = require('fs').promises;
const bcrypt = require('bcrypt');

const userDB = {
	users: require('../model/users.json'),
	setUsers: function(data) {
		this.users = data;
	}
};

const handleNewUser = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: 'username and password required !' });
	}
	const dupliacte = userDB.users.find((user) => user.username === username);
	if (dupliacte) {
		return res.status(401).json({ error: `user with ${username} exists.` });
	}
	try {
		const hashedPwd = await bcrypt.hash(password, 10);
		const newUser = { username, password: hashedPwd };
		userDB.setUsers([ ...userDB.users, newUser ]);
		await promises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(userDB.users),
			'utf8'
		);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
	return res.status(201).json({ success: `user ${username} created !` });
};

module.exports = handleNewUser;
