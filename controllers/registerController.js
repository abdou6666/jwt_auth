const bcrypt = require('bcrypt');

const User = require('../model/User');

const handleNewUser = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: 'username and password required !' });
	}
	const dupliacte = await User.findOne({ username }).exec();
	if (dupliacte) {
		return res.status(401).json({ error: `user with ${username} exists.` });
	}
	try {
		const hashedPwd = await bcrypt.hash(password, 10);
		// craete new user & store
		const result = await User.create({
			username,
			password: hashedPwd
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
	return res.status(201).json({ success: `user ${username} created !` });
};

module.exports = handleNewUser;
