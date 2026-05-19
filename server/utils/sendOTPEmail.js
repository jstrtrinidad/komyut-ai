import nodemailer from "nodemailer";

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Komyut AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Komyut AI Account",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f5ef; padding: 40px; color: #000000;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #ece7dc;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #f4b400; width: 60px; height: 60px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; line-height: 60px; font-weight: bold; color: #000000;">✦</div>
            <h1 style="font-size: 24px; font-weight: 800; margin-top: 20px; color: #000000; letter-spacing: -0.5px;">komyut<span style="color: #f4b400;">AI</span></h1>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 10px; color: #000000;">Verify Your Email</h2>
            <p style="color: #5f6368; font-size: 15px; line-height: 1.6;">Use the code below to complete your verification and start managing smarter urban commutes.</p>
          </div>
          
          <div style="background-color: #faf7f2; border-radius: 20px; padding: 30px; text-align: center; border: 2px dashed #ece7dc; margin-bottom: 30px;">
            <div style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #f4b400; margin: 0;">${otp}</div>
          </div>
          
          <div style="text-align: center; font-size: 13px; color: #5f6368;">
            <p>This code will expire in <span style="font-weight: 600; color: #000000;">5 minutes</span>.</p>
            <p style="margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #ece7dc; text-align: center;">
            <p style="font-size: 12px; color: #9aa0a6; margin: 0;">&copy; 2026 Komyut AI. Metro Manila, Philippines.</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;