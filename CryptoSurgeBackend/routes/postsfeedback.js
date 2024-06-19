const express = require('express');
const { body } = require('express-validator');

const postsfeedbackController = require('../controllers/postsfeedback');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', postsfeedbackController.fetchAll);
router.get('/:id', auth, postsfeedbackController.fetchSpecific);
router.post(
	'/',
	[
		auth,
		body('user_id').isInt().not().isEmpty(),
		body('post_id').isInt().not().isEmpty(),
		body('feedback_type').isInt().not().isEmpty(),
	], 
	postsfeedbackController.postFeedback
);
router.delete(
	'/',
	[
		auth,
		body('user_id').isInt().not().isEmpty(),
		body('post_id').isInt().not().isEmpty(),
	], 
	postsfeedbackController.deleteFeedback
);
// router.delete(
//     '/deleteAll',
//     [
//         auth,
//         body('user_id').isInt().not().isEmpty(),
//         body('post_id').isInt().not().isEmpty(),
//     ],
//     postsfeedbackController.deleteAllFeedbacks
// );
 
module.exports = router;