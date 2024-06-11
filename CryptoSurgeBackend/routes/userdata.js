const express = require('express');
const { body } = require('express-validator');
const userdataController = require('../controllers/userdata');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/:id', auth, userdataController.fetchAll);
router.post(
  '/',
  [
    auth,
    body('user_id').isInt().not().isEmpty(),
  ],
  userdataController.insert
);
router.put(
  '/',
  [
    auth,
    body('field').isString().not().isEmpty(),
    body('value').isInt().not().isEmpty(),
    body('user_id').isInt().not().isEmpty(),
  ],
  userdataController.update
); 


module.exports = router;
 