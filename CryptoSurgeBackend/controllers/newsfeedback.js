const { validationResult } = require('express-validator');
const newsfeedback = require('../models/newsfeedback');
exports.fetchAll = async (req, res, next) => {
	try {
		const allFeedbacks = await newsfeedback.fetchAll();
		res.status(200).json(allFeedbacks);
	} catch (err) {
	    console.error('Error fetch all feedbacks from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};
exports.fetchSpecific = async (req, res, next) => {
	try {
		const allFeedbacks = await newsfeedback.fetchSpecific(req.params.id);
		res.status(200).json(allFeedbacks);
	} catch (err) {
	    console.error('Error fetch specific feedbacks from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};
exports.postFeedback = async (req, res, next) => {
	const errors = validationResult(req);
	// this if maybe prints the error i do not want to show
	if (!errors.isEmpty()) {
	    return res.status(422).json({ errors: errors.array() });
	}
	const user_id = req.body.user_id;
	const news_id = req.body.news_id;
	const feedback_type = req.body.feedback_type;
	try {
	    const feedback = {
	        user_id: user_id,
	        news_id: news_id,
	        feedback_type: feedback_type
	    }
	    const result = await newsfeedback.save(feedback);
	    res.status(201).json({ message: 'Feedbacked!' });
	} catch (err) {
	    console.error('Error saving feedback to database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};
exports.deleteFeedback = async (req, res, next) => {
	const errors = validationResult(req);
	// this if maybe prints the error i do not want to show
	if (!errors.isEmpty()) {
	    return res.status(422).json({ errors: errors.array() });
	}
	const user_id = req.body.user_id;
	const news_id = req.body.news_id;
	if (typeof user_id === 'string' || typeof news_id === 'string'){
		return res.status(422).json({ message: 'Error deleting feedback from database' });
	}
	try {
	    const feedback = {
	        user_id: user_id,
	        news_id: news_id,
	    }
	    const result = await newsfeedback.delete(feedback);
	    res.status(201).json({ message: 'Feedbacked!' });
	} catch (err) {
	    console.error('Error deleting feedback from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};