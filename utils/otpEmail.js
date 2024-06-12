const nodemailer = require("nodemailer");

function otpEmail(email, username) {
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const otp = generateOTP();
  const otpExpires = Date.now() + 3600000;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });

  const mailOption = {
    from: "512mughees@gmail.com",
    to: email,
    subject: "Verification Mail",
    html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            font-size: 18px;
            color: #333;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">EliteEmporium</div>
        <div class="content">
            <p>Dear ${username},</p>
            <p>Thank you for registering with <strong>EliteEmporium</strong>. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
            <p class="otp">${otp}</p>
            <p>If you did not initiate this request, please ignore this email. For any assistance, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EliteEmporium. All rights reserved.</p>
        </div>
    </div>
</body>
    </html>`,
  };

  transporter.sendMail(mailOption, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Done", info.response);
    }
  });

  return { otp, otpExpires };
}

module.exports = otpEmail;
