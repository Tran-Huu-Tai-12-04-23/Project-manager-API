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
      const { password, confirm_password, email, uid, photoURL, displayName } =
        req.body;
      let check = !password || !confirm_password;
      let check2 = !uid || !photoURL || !displayName || !email;
      if (check === false && check2 === false) {
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
      let passwordHash = "";
      if (password) {
        const passwordHash = await Util.hashPassword(password);
      }

      const isEmailTaken = await User.checkEmailAlready(email);
      if (isEmailTaken && !uid) {
        return res.status(200).json({
          status: false,
          message: "Email is already taken. Please try again.",
        });
      } else if (uid && photoURL && displayName) {
        await User.editUser({
          uid,
          photoURL,
          displayName,
          email,
        });
        res.status(200).json({
          status: true,
          message: "Registration successful!",
        });
      } else {
        await User.createNewUser({
          email: email,
          password: passwordHash,
        });
        res.status(200).json({
          status: true,
          message: "Registration successful!",
        });
      }
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
    Util.sendEmail(
      email,
      "verify code",
      `<b>Code verify for you is : <span style='color: blue'}> ${code} </span></b>`
    )
      .then((info) => {
        // console.log(info);
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

  async checkEmailAlreadyExists(req, res) {
    const email = req.body.email;
    if (!email) {
      return res.json({ status: false, message: "Invalid data" });
    }
    const isEmailTaken = await User.checkEmailAlready(email);

    if (isEmailTaken) {
      return res.status(200).json({
        status: true,
        message: "Email này tồn tại!",
      });
    }

    res.json({ status: false, message: "Email không tôn tại!" });
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ status: false, message: "Invalid data" });
    }

    const isEmailTaken = await User.checkEmailAlready(email);

    if (!isEmailTaken) {
      return res.json({ status: false, message: "Email không tồn tại!" });
    }

    let user = await User.findUser({ email: email });
    if (user) {
      const checkPassword = await Util.verifyPassword(password, user.password);

      if (checkPassword) {
        return res.json({
          status: true,
          message: "Đăng nhập thành công!",
          user: JSON.stringify(user),
        });
      } else {
        return res.json({
          status: false,
          message: "Mật khẩu sai, vui lòng nhập lại!",
        });
      }
    }

    return res.json({ status: false, message: "Tài khoản không tồn tại!" });
  }
}

module.exports = new UserController();
