const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signup);
router.route('/signout').post(authController.signup);


module.exports = router;
