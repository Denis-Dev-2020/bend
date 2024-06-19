const express = require('express');
const { body } = require('express-validator');

const newsfeedbackController = require('../controllers/newsfeedback');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', newsfeedbackController.fetchAll);
router.get('/:id', auth, newsfeedbackController.fetchSpecific);
router.post(
	'/',
	[
		auth,
		body('user_id').isInt().not().isEmpty(),
		body('news_id').isInt().not().isEmpty(),
		body('feedback_type').isInt().not().isEmpty(),
	], 
	newsfeedbackController.postFeedback
);
router.delete(
	'/',
	[
		auth,
		body('user_id').isInt().not().isEmpty(),
		body('news_id').isInt().not().isEmpty(),
	], 
	newsfeedbackController.deleteFeedback
);

module.exports = router;