require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// NOTE: was previously hardcoded as the string 'apple' in auth.js and
// authController.js. Falls back to that same value only so existing
// tokens don't all break the moment this ships — set a real secret in
// .env and remove the fallback.
const JWT_SECRET = process.env.JWT_SECRET || 'apple';

// Used to build the password-reset link that gets emailed to the user,
// e.g. `${CLIENT_URL}/reset-password/:token`
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Optional SMTP config for actually sending the reset email. If any of
// these are missing, forgotPassword() falls back to logging the reset
// link to the server console instead of sending mail, so the feature is
// still testable in dev without setting up a mail account.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@notes-app.local';

module.exports = {
    MONGODB_URI,
    PORT,
    HOST,
    JWT_SECRET,
    CLIENT_URL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
}
