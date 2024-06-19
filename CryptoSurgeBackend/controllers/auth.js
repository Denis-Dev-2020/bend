////////////////////// HERE WILL BE THE SET KEY GENERATOR SECRET ///////////////////////
        // const token = jwt.sign(
        //     {
        //         email: storedUser.email,
        //         userId: storedUser.id
        //     },
        //     'secretfortokenERTt1231',
        //     { expiresIn: tokenExpiry }
        // );
/////////////////////////////////////////////////////////////////////////////////////////
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { firstname, lastname, email, phone, country, date_of_birth, company, password, newsletter } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const userDetails = {
            firstname,
            lastname,
            email,
            phone,
            country,
            date_of_birth,
            company: company || '',
            password: hashedPassword,
            newsletter
        };
        const result = await User.save(userDetails);
        res.status(201).json({ message: 'User registered!' });
    } catch (err) {
        console.error('Error saving user to database:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.login = async (req, res, next) => {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await User.find(email);
        if (user[0].length !== 1) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        const storedUser = user[0][0];
        const isEqual = await bcrypt.compare(password, storedUser.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
		const tokenExpiry = rememberMe ? '7d' : '1h';
		const token = jwt.sign(
		    {
		        email: storedUser.email,
		        userId: storedUser.id
		    },
		    'secretfortokenERTt1231',
		    { expiresIn: tokenExpiry }
		);
        res.status(200).json({ token, userId: storedUser.id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};