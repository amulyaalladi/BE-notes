const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailer = require('../../utils/mailer'); // Adjust path to match your folder structure
//const crypto = require('crypto');
//const User = require('../models/User');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');
const {
    JWT_SECRET,
    CLIENT_URL,
   
} = require('../../utils/config');

// Only build a real mail transporter if SMTP is actually configured.
// Otherwise forgotPassword() logs the reset link to the console instead,
// so the flow is still testable without a mail account set up.

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email and password are required.' });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            return res.status(201).json({
                message: 'User registered successfully.',
                user: { id: user._id, name: user.name, email: user.email }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error registering user.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password.' });
            }

            // Was hardcoded `role: 'user'` for every login, and signed with the
            // literal string 'apple' — now uses the user's real role and the
            // shared JWT_SECRET from config.
            const token = await jwt.sign(
                { userId: existingUser._id, role: existingUser.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: isProd ? 'None' : 'Lax',
                secure: isProd,
            });
            return res.status(200).json({
                message: 'Login successful.',
                token,
                user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error logging in.' });
        }
    },
    me: async(req,res)=>{
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated.' });
            }

            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.status(200).json({ message: 'details fetched', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching user details.' });
        }
    },

    // POST /auth/forgot-password  { email }
    // Always responds with the same generic message whether or not the
    // email exists, so this endpoint can't be used to check which emails
    // are registered.
    forgotPassword: async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const genericResponse = {
            message: 'If that email is registered, a password reset link has been sent.',
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json(genericResponse);
        }

        // Generate a secure raw token and its SHA-256 hash for database storage
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

        if (mailer) {
            await mailer.sendMail({
                from: process.env.SMTP_USER,
                to: user.email,
                subject: 'Reset your Notes App password',
                html: `
                    <p>You requested a password reset.</p>
                    <p>Click the link below to reset your password. This link expires in 1 hour:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            });
        } else {
            console.log(`[forgotPassword] SMTP not configured. Reset link for ${email}: ${resetUrl}`);
        }

        return res.status(200).json(genericResponse);
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Error processing password reset request.' });
    }
},

    // POST /auth/reset-password/:token  { email, password }
    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ message: 'Token and new password are required.' });
            }

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
            }

            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.status(200).json({ message: 'Password has been reset successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error resetting password.' });
        }
    },

    logout: async (request, response) => {
        try {
            // clear the token from the cookies
            response.clearCookie('token');

            response.status(200).json({ message: 'User logged out successfully!' });
        } catch (e) {
            return response.status(500).json({ message: 'Error logging out. Try again later!', error: e.message });
        }
    }

};

module.exports = authController;