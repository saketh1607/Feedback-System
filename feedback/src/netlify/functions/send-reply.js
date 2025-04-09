import nodemailer from 'nodemailer';

export const handler = async (event) => {
  try {
    const { toEmail, subject, body } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.REPLY_EMAIL,
        pass: process.env.REPLY_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.REPLY_EMAIL,
      to: toEmail,
      subject,
      text: body,
    });

    console.log('Email sent:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Send mail error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
