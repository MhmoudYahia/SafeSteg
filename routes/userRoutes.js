const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);
router.route('/signout').post(authController.signout);
router.route('/forgetpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.use(authController.protect);
router.route('/me').get(userController.getMe);
router.route('/changepassword').patch(authController.changePassword);
router
  .route('/changeme')
  .patch(
    userController.uploadImage,
    userController.resizePhoto,
    userController.changeMe
  );

module.exports = router;
