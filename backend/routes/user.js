const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');

const router = require('express').Router();

// GET ALL USERS
router.get('/', middlewareController.verifyToken, userController.getAllUser);

// DELETE USER
router.delete(
	'/:id',
	middlewareController.verifyTokenAndAdminAuth,
	userController.deleteOneUser
);

module.exports = router;
