import nodemailer from 'nodemailer';

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Xpenly Team" <no-reply@xpenly.com>',

    // ✅ USER KI EMAIL (DYNAMIC)
    to: email,

    subject: '🔐 Your Xpenly OTP Verification Code',

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Xpenly OTP</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f6fb;
    font-family: Arial, Helvetica, sans-serif;
  }

  .container {
    max-width: 520px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    animation: fadeIn 0.8s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    padding: 24px;
    text-align: center;
    color: #ffffff;
  }

  .header h1 {
    margin: 0;
    font-size: 26px;
    letter-spacing: 0.5px;
  }

  .content {
    padding: 28px;
    text-align: center;
  }

  .content p {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .otp-box {
    display: inline-block;
    background: #f1f5f9;
    border: 2px dashed #2563eb;
    color: #1e3a8a;
    font-size: 32px;
    letter-spacing: 8px;
    padding: 14px 24px;
    border-radius: 12px;
    font-weight: bold;
    margin: 20px 0;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .note {
    font-size: 13px;
    color: #6b7280;
    margin-top: 20px;
  }

  .footer {
    background: #f9fafb;
    padding: 16px;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
  }
</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Xpenly</h1>
      <p>Secure Login Verification</p>
    </div>

    <div class="content">
      <p>
        Hello 👋<br />
        Use the OTP below to verify your email and continue securely.
      </p>

      <div class="otp-box">${otp}</div>

      <p class="note">
        ⏱ This OTP is valid for <b>5 minutes</b>.<br />
        Please do not share this code with anyone.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Xpenly. All rights reserved.<br />
      This is an automated message, please do not reply.
    </div>
  </div>
</body>
</html>`,
  });
};
