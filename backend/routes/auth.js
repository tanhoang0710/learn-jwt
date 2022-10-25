const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// REFRESH TOKEN
router.post('/refresh', authController.refreshToken);

// middleware de chac chan da signin
router.post(
	'/logout',
	middlewareController.verifyToken,
	authController.userLogout
);

module.exports = router;
