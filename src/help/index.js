const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

class Util {
  async hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds to generate
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      // Handle error
      console.error("Error hashing password:", error);
      throw error;
    }
  }
  async verifyPassword(password, hashedPassword) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      // Handle error
      console.error("Error verifying password:", error);
      throw error;
    }
  }
  generateVerificationCode() {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  sendEmail(to, subject = "verify code ✔", htmlContent) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "huutaidev@gmail.com", // generated ethereal user
        pass: "vynpmzlehxevdqxg", // generated ethereal passwordƯ
      }, // Sender's email password
    });
    const mailOptions = {
      from: "huutaidev@gmail.com",
      to: to,
      subject: subject,
      text: "code verify for you is : ",
      html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
  }
}

module.exports = new Util();
