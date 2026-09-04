const nodemailer = require('nodemailer');

// Only create a real transporter if SMTP is fully configured.
// If not, mailer will be null and forgotPassword() falls back to
// logging the reset link to the console — useful for local dev.
const isConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_PORT;

const mailer = isConfigured
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT), // must be a number
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
          },
      })
    : null;

module.exports = mailer;