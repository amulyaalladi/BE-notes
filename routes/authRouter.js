const express = require('express');
const authController = require('./controllers/authController');
const {isAuthenticated}=require('../auth')

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password/:token', authController.resetPassword);

//protected routes
authRouter.get('/me',isAuthenticated,authController.me);
authRouter.post('/logout',isAuthenticated, authController.logout);

module.exports = authRouter;