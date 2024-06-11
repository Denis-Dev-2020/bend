const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');
router.post(
	'/signup',
	[
		body('firstname').trim().not().isEmpty(),
		body('lastname').trim().not().isEmpty(),
		body('email').isEmail().withMessage('Please enter a valid email.').custom(async (email) => {
			const user = await User.find(email);
			if (user[0].length > 0){
				return Promise.reject('Email address already exist!');
			}
		}).normalizeEmail(),
		body('phone').trim().not().isEmpty(),
		body('country').trim().not().isEmpty(),
		body('date_of_birth').trim().not().isEmpty(),
		body('company').optional().trim(),
		body('password').trim().isLength({ min: 8 }),
		body('newsletter').trim().not().isEmpty(),
	], 
	authController.signup
);
router.post('/login',authController.login);
module.exports = router;