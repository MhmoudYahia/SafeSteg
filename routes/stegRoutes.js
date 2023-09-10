const express = require('express');

const router = express.Router();

const stegController = require('../controllers/stegController');

router
  .route('/authority-generateKey')
  .post(stegController.generateKeyFromAuthority);

router.route('/authority-checkme').post(stegController.checkMeOnAuthority);

module.exports = router;
