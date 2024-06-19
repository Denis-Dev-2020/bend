const { validationResult } = require('express-validator');
const postsfeedback = require('../models/postsfeedback');
exports.fetchAll = async (req, res, next) => {
	try {
		const allFeedbacks = await postsfeedback.fetchAll();
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
		const allFeedbacks = await postsfeedback.fetchSpecific(req.params.id);
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
	const post_id = req.body.post_id;
	const feedback_type = req.body.feedback_type;
	try {
	    const feedback = {
	        user_id: user_id,
	        post_id: post_id,
	        feedback_type: feedback_type
	    }
	    const result = await postsfeedback.save(feedback);
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
	const post_id = req.body.post_id;
	if (typeof user_id === 'string' || typeof post_id === 'string'){
		return res.status(422).json({ message: 'Error deleting feedback from database' });
	}
	try {
	    const feedback = {
	        user_id: user_id,
	        post_id: post_id,
	    }
	    const result = await postsfeedback.delete(feedback);
	    res.status(201).json({ message: 'Feedbacked!' });
	} catch (err) {
	    console.error('Error deleting feedback from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
}; 
exports.deleteAllFeedbacks = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const user_id = req.body.user_id;
    const post_id = req.body.post_id;
    if (typeof user_id === 'string' || typeof post_id === 'string'){
        return res.status(422).json({ message: 'Error deleting feedback from database' });
    }
    try {
        const result = await postsfeedback.deleteAll(post_id, user_id);
        res.status(201).json({ message: 'All feedbacks deleted!' });
    } catch (err) {
        console.error('Error deleting feedback from database:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};