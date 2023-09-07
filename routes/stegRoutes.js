const express = require('express');

const router = express.Router();

const stegController = require('../controllers/stegController');
router
  .route('/encodeimage')
  .post(stegController.uploadImage, stegController.enStegImage);
router
  .route('/decodeimage')
  .get(stegController.uploadImage, stegController.deStegImage);

router
  .route('/authority-generateKey')
  .post(stegController.generateKeyFromAuthority);

router.route('/authority-checkme').post(stegController.checkMeOnAuthority);

module.exports = router;
