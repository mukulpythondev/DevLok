import nodemailer from "nodemailer";

export const sendMail = async (senderMail, otp) => {
  try {
    // Create transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.GMAIL, // Your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Gmail App Password
      },
    });

    // Set up mail options
    const mailOptions = {
      from: '"Devlok" <mukulgenious123@gmail.com>', // Sender's email address
      to: senderMail, // Recipient's email address
      subject: "Verify your Account on Devlok", // Subject line
      text: `Your OTP is: ${otp}`, // Plain text body
      html: `<p>Thanks for signing up on Devlok! Your OTP is: <b>${otp}</b></p>`, // HTML body
    };

    // Send the email and handle the response with a callback
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('Error in sending email:', error);
        return { success: false, error: error.message };
      } else {
        console.log('Email sent successfully: ' + info.response);
        return { success: true, messageId: info.messageId };
      }
    });
  } catch (error) {
    console.error("Error in setting up email:", error);
    return { success: false, error: error.message };
  }
};
