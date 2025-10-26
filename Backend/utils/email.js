const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || `"Wellness" <no-reply@example.com>`;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn('Warning: SMTP not fully configured. forgot-password emails will fail until SMTP vars are set.');
}


const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * sendResetEmail({ to, name, resetLink })
 */
async function sendResetEmail({ to, name = '', resetLink }) {
  if (!transporter) throw new Error('Email transporter not configured');

  const html = `
    <p>Hi ${name || 'there'},</p>
    <p>You requested a password reset for your Wellness account. Click the button below to reset your password. This link expires in 60 minutes.</p>
    <p><a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;">Reset password</a></p>
    <p>If that doesn't work, copy and paste the following URL into your browser:</p>
    <p><small>${resetLink}</small></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>— Wellness app</p>
  `;

  const mail = {
    from: FROM_EMAIL,
    to,
    subject: 'Reset your Wellness app password',
    html
  };

  return transporter.sendMail(mail);
}

module.exports = { sendResetEmail };
