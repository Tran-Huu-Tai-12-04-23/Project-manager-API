const User = require("../model/User");
const Util = require("../help/index");
const nodemailer = require("nodemailer");

class UserController {
  async getAllUsers() {
    try {
      const users = await User.findUsers();
      console.log("All users:", users);
    } catch (error) {
      console.error("Error querying users:", error);
    }
  }
  // register
  async register(req, res) {
    try {
      const { password, confirm_password, email } = req.body;
      if (!password || !confirm_password || !email) {
        return res.status(200).json({
          status: false,
          message: "Invalid data!",
        });
      }

      if (password !== confirm_password) {
        return res.status(200).json({
          status: false,
          message: "Password and confirm password do not match!",
        });
      }

      const passwordHash = await Util.hashPassword(password);

      const isEmailTaken = await User.checkEmailAlready(email);
      if (isEmailTaken) {
        return res.status(200).json({
          status: false,
          message: "Email is already taken. Please try again.",
        });
      }

      await User.createNewUser({
        email: email,
        password: passwordHash,
      });

      return res.status(200).json({
        status: true,
        message: "Registration successful!",
      });
    } catch (error) {
      console.error("Error in registration:", error);
      return res.status(500).json({
        status: false,
        message: "An error occurred during registration.",
      });
    }
  }
  //send email
  async sendEmail(req, res) {
    const data = req.body;
    const { email } = data;
    if (!email) {
      return res.json({
        status: false,
        message: "Invalid data",
      });
    }
    const code = Util.generateVerificationCode();
    console.log(email);
    Util.sendEmail(
      email,
      "verify code",
      `<b>Code verify for you is : <span style='color: blue'}> ${code} </span></b>`
    )
      .then((info) => {
        console.log(info);
        return res.json({
          status: true,
          message: "Vui lòng kiểm tra email!",
          code: code,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.json({ status: false, message: "Không gửi được email" });
      });
  }
}

module.exports = new UserController();
