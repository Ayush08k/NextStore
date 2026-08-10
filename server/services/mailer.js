import nodemailer from 'nodemailer';

let transporter;

// Create test account or fallback transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Nodemailer initialized with Ethereal test mailbox:', testAccount.user);
    return transporter;
  } catch (err) {
    console.warn('Fallback to jsonTransport for mailer:', err.message);
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
    return transporter;
  }
};

export const sendNotificationEmail = async ({ to, subject, html, text }) => {
  try {
    const mailTransporter = await getTransporter();
    const info = await mailTransporter.sendMail({
      from: '"NextStore Support" <no-reply@nextstore.com>',
      to: to || 'customer@example.com',
      subject: subject || 'NextStore Order Notification',
      text: text || 'Thank you for your request with NextStore.',
      html: html || `<p>Thank you for choosing <strong>NextStore</strong>!</p>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Email sent! MessageID:', info.messageId);
    if (previewUrl) {
      console.log('Preview Email URL:', previewUrl);
    }
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};
