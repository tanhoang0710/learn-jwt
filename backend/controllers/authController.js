const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let refreshTokens = [];

const authController = {
	// REGISTER
	registerUser: async (req, res) => {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(req.body.password, salt);

			// Create new user
			const newUser = await new User({
				userName: req.body.userName,
				email: req.body.email,
				password: hashed,
			});

			// Save to database
			const user = await newUser.save();
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	},
	// GENERATE ACCESS TOKEN
	generateAccessToken: (user) => {
		return jwt.sign(
			{
				id: user._id,
				admin: user.admin,
			},
			process.env.JWT_ACCESS_KEY,
			{
				expiresIn: '20s',
			}
		);
	},
	// GENERATE REFRESH TOKEN
	generateRefreshToken: (user) => {
		return jwt.sign(
			{
				id: user._id,
				admin: user.admin,
			},
			process.env.JWT_REFRESH_KEY,
			{
				expiresIn: '365d',
			}
		);
	},

	loginUser: async (req, res) => {
		try {
			const user = await User.findOne({
				userName: req.body.userName,
			});

			if (!user) return res.status(404).json('Wrong username');

			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPassword) return res.status(404).json('Wrong password');

			if (user && validPassword) {
				const accessToken = authController.generateAccessToken(user);

				const refreshToken = authController.generateRefreshToken(user);

				refreshTokens.push(refreshToken);

				// LƯU REFRESHTOKEN VÀO COOKIES
				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					path: '/',
					sameSite: 'strict',
					secure: false, // deploy set to true
				});

				const { password, ...others } = user._doc;
				return res.status(200).json({ ...others, accessToken });
			}
		} catch (error) {
			res.status(500).json(error);
		}
	},

	// REDIS
	refreshToken: async (req, res) => {
		// Lấy refresh token from user
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken)
			return res.status(401).json("You're not authenticated");
		if (!refreshTokens.includes(refreshToken)) {
			return res.status(403).json('Refresh token is not valid');
		}
		jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
			if (err) {
				console.log(err);
			} else {
				refreshTokens = refreshTokens.filter(
					(token) => token !== refreshToken
				);
				// create new accesstoken, refresh token
				console.log(user);
				const newAccessToken = authController.generateAccessToken(user);
				const newRefreshToken =
					authController.generateRefreshToken(user);

				refreshTokens.push(newRefreshToken);

				// LƯU REFRESHTOKEN VÀO COOKIES
				res.cookie('refreshToken', newRefreshToken, {
					httpOnly: true,
					path: '/',
					sameSite: 'strict',
					secure: false, // deploy set to true
				});

				return res.status(200).json({
					accessToken: newAccessToken,
				});
			}
		});
	},

	// LOGOUT
	userLogout: async (req, res) => {
		res.clearCookie('refreshToken');
		refreshTokens = refreshTokens.filter(
			(token) => token !== req.cookies.refreshToken
		);
		return res.status(200).json('Logged out !');
	},
};

// STORE TOKEN
// 1) LOCAL STORAGE
// XSS
// 2) HTTPONLY COOKIES
// ÍT BỊ ẢNH HƯỞNG BỞI XSS
// CSRF -> SAMESITE
// 3) REDUX STORE -> ACCESSTOKEN
// HTTPONLY COOKIES -> REFRESHTOKEN

// BFF PATTERN (BACKEND FOR FRONTEND)

module.exports = authController;
