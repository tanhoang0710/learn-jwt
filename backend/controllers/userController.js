const bcrypt = require('bcrypt');
const User = require('../models/User');

const userController = {
	getAllUser: async (req, res) => {
		try {
			const users = await User.find();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json(error);
		}
	},

	deleteOneUser: async (req, res) => {
		try {
			const user = await User.findById(req.params.id);
			if (user) {
				return res.status(200).json('Delete successfully!');
			}
			return res.status(404).json('Not found!');
		} catch (error) {
			res.status(500).json(error);
		}
	},
};

module.exports = userController;
