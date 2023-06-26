const Util = require("../help/index");
const nodemailer = require("nodemailer");

const {
  createNewUser,
  updateUser,
  checkEmailAlready,
  findUser,
  findUsers,
} = require("../model/User.model");

const { createNewOtp, verifyOtp } = require("../model/Otp.model");

class UserController {
  async getAllUsers() {
    // try {
    //   const users = await User.findUsers();
    //   console.log("All users:", users);
    // } catch (error) {
    //   console.error("Error querying users:", error);
    // }
  }
  // register
  async register(req, res, next) {
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
        passwordHash = await Util.hashPassword(password);
      }
      const isEmailTaken = await checkEmailAlready(email);
      let result = false;
      if (isEmailTaken && !uid) {
        return res.status(200).json({
          status: false,
          message: "Email is already taken. Please try again.",
        });
      } else if (uid && photoURL && displayName) {
        if (isEmailTaken) {
          result = await updateUser({ id: uid, photoURL, displayName, email });
        } else {
          result = await createNewUser({
            id: uid,
            photoURL,
            displayName,
            email,
          });
        }
      } else {
        result = await createNewUser({
          email: email,
          password: passwordHash,
        });
      }
      if (result) {
        res.status(200).json({
          status: true,
          message: "Register successfully!!.",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Register failed!!.",
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
  async sendEmail(req, res, next) {
    try {
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
        .then(async (info) => {
          // console.log(info);
          const result = await createNewOtp(email, code);
          if (result) {
            res.json({
              status: true,
              message: "Vui lòng kiểm tra email!",
            });
          } else {
            res.json({
              status: false,
              message: "Gửi thất bại!",
            });
          }
          return;
        })
        .catch((error) => {
          console.error(error);
          return res.json({ status: false, message: "Không gửi được email" });
        });

      return;
    } catch (error) {
      next(error);
    }
  }

  async verifyCode(req, res, next) {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.json({ status: false, message: "Invalid data" });
      }

      const result = await verifyOtp(email, code);

      if (result)
        return res.json({ status: true, message: "Xác thực thành công!" });

      res.json({ status: false, message: "Xác thực thất bại!" });
    } catch (error) {
      next(error);
    }
  }

  async checkEmailAlreadyExists(req, res, next) {
    try {
      const email = req.body.email;
      if (!email) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const isEmailTaken = await checkEmailAlready(email);
      if (isEmailTaken) {
        return res.status(200).json({
          status: true,
          message: "Email này tồn tại!",
        });
      }
      res.json({ status: false, message: "Email không tôn tại!" });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const isEmailTaken = await checkEmailAlready(email);
      if (!isEmailTaken) {
        return res.json({ status: false, message: "Email không tồn tại!" });
      }
      let user = await findUser({ email: email });
      let hashPass = await Util.hashPassword(password);
      if (user) {
        const checkPassword = await Util.verifyPassword(
          password,
          user.password
        );
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
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { password, confirm_password, email } = req.body;
      if (!password || !confirm_password || !email) {
        return res.json({ status: false, message: "Invalid data" });
      }
      const isEmailTaken = await checkEmailAlready(email);
      if (!isEmailTaken) {
        return res.json({
          status: false,
          message: "Tài khoản không tồn tại!!",
        });
      }
      if (password !== confirm_password) {
        return res.json({
          status: false,
          message: "Xác nhận mật khẩu không khớp !",
        });
      }
      let hashPassword = await Util.hashPassword(password);
      await updateUser({
        email: email,
        password: hashPassword,
      });
      res.json({
        status: true,
        message: "Thay đổi mật khẩu thành công!",
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { userId } = req.query;
      let condition = {};
      if (userId) {
        condition = { _id: { $ne: userId } };
      }
      const data = await findUsers(condition);
      res.json({
        status: true,
        data: JSON.stringify(data),
      });
    } catch (error) {
      next(error);
    }
  }

  async getId(req, res, next) {
    try {
      const { email, displayName } = req.body;
      if (!email && !displayName) {
        return res.json({ status: false, message: "Invalid data!!" });
      }
      const result = await findUser({ email, displayName });
      if (result) {
        return res.json({
          status: true,
          message: "successfully retrieved",
          _id: result._id,
        });
      }
      res.json({ status: false, message: "Failed" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = new UserController();
