import nodemailer from "nodemailer";

interface SendEmailParams {
  email: string;
  orderTitle: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = async ({ email, orderTitle }: SendEmailParams) => {
  try {
    const mailOptions = {
      from: "Order Service",
      to: email,
      subject: `Order Confirmation - ${orderTitle}`,
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #fff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; text-align: center;">Order Service!</h1>
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Order Confirmation</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5;">Dear customer,</p>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            We have received your order. The item you ordered is:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 25px 0; border-radius: 4px;">
            <span style="font-size: 20px; font-weight: bold; color: #333;">${orderTitle}</span>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5;">If you did not request this order, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <footer style="text-align: center; font-size: 14px; color: #888;">
            <p>© 2025 Order Service</p>
            <p>All rights reserved.</p>
            <p style="margin-top: 10px;">This is an automated message. Please do not reply to this email.</p>
          </footer>
        </div>
      </body>
      </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId, email, orderTitle);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
