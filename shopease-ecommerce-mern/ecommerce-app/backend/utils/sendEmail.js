const nodemailer = require('nodemailer');

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an email. Silently no-ops (with a console log) if SMTP is not configured,
 * so the app keeps working in dev/demo environments without email credentials.
 * @param {{to: string, subject: string, html: string}} options
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`[email disabled] Would have sent "${subject}" to ${to}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'No Reply <no-reply@example.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
};

module.exports = sendEmail;
