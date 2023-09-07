const express = require('express');

const router = express.Router();

const stegController = require('../controllers/stegController');
router.route('encodeimage').post(stegController.uploadImage, stegController.enStegImage);
router.route('decodeimage').get(stegController.uploadImage, stegController.deStegImage);

module.exports = router;
