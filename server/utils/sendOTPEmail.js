import nodemailer from "nodemailer";

const sendOTPEmail = async (
  email,
  otp
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Komyut AI OTP Verification",

    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;