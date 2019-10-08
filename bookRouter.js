const express = require('express');
const controller = require('./bookController');

const router = express.Router();
router.route('/').get(controller.getEbookList);
router.route('/download').get(controller.getDownloadLink);

module.exports = router;