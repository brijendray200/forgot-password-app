const express = require('express');
const { handleForgotPassword } = require('../controllers/forgotPasswordController');

const router = express.Router();

router.post('/', handleForgotPassword);

module.exports = router;
