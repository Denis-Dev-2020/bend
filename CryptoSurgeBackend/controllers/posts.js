const { validationResult } = require('express-validator');
const Post = require('../models/post');
exports.fetchAll = async (req, res, next) => {
	try {
		const [allPosts] = await Post.fetchAll();
		res.status(200).json(allPosts);
	} catch (err) {
	    console.error('Error fetch posts from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};
exports.postPost = async (req, res, next) => {
	const errors = validationResult(req);
	// this if maybe prints the error i do not want to show
	if (!errors.isEmpty()) {
	    return res.status(422).json({ errors: errors.array() });
	}
	const title = req.body.title;
	const body = req.body.body;
	const user = req.body.user;
	try {
	    const post = {
	        title: title,
	        body: body,
	        user: user
	    }
	    const result = await Post.save(post);
	    res.status(201).json({ message: 'Posted!' });
	} catch (err) {
	    console.error('Error saving post to database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};
exports.deletePost = async (req, res, next) => {
	try {
		const deleteResponse = await Post.delete(req.params.id);
		res.status(200).json(deleteResponse);
	} catch (err) {
	    console.error('Error fetch posts from database:', err);
	    if (!err.statusCode) {
	        err.statusCode = 500;
	    }
	    next(err);
	}
};