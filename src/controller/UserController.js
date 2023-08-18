const Util = require('../help/index');
const nodemailer = require('nodemailer');
const { getProject } = require('../model/Project.model');

const {
    createNewUser,
    updateUser,
    checkEmailAlready,
    findUser,
    findUsers,
    updateUserById,
} = require('../model/User.model');

const { createNewOtp, verifyOtp } = require('../model/Otp.model');
const { create, checkExist, findProfile, update, upBackGround } = require('../model/Profile.model');

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
            const { password, confirm_password, email, uid, photoURL, displayName } = req.body;
            let check = !password || !confirm_password;
            let check2 = !uid || !photoURL || !displayName || !email;
            if (check === false && check2 === false) {
                return res.status(200).json({
                    status: false,
                    message: 'Invalid data!',
                });
            }
            if (password !== confirm_password) {
                return res.status(200).json({
                    status: false,
                    message: 'Password and confirm password do not match!',
                });
            }
            let passwordHash = '';
            if (password) {
                passwordHash = await Util.hashPassword(password);
            }
            const isEmailTaken = await checkEmailAlready(email);
            let result = false;
            if (isEmailTaken && !uid) {
                return res.status(200).json({
                    status: false,
                    message: 'Email is already taken. Please try again.',
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
                    message: 'Register successfully!!.',
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: 'Register failed!!.',
                });
            }
        } catch (error) {
            console.error('Error in registration:', error);
            return res.status(500).json({
                status: false,
                message: 'An error occurred during registration.',
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
                    message: 'Invalid data',
                });
            }
            const code = Util.generateVerificationCode();
            Util.sendEmail(
                email,
                'verify code',
                `<b>Code verify for you is : <span style='color: blue'}> ${code} </span></b>`,
            )
                .then(async (info) => {
                    // console.log(info);
                    const result = await createNewOtp(email, code);
                    if (result) {
                        res.json({
                            status: true,
                            message: 'Vui lòng kiểm tra email!',
                        });
                    } else {
                        res.json({
                            status: false,
                            message: 'Gửi thất bại!',
                        });
                    }
                    return;
                })
                .catch((error) => {
                    console.error(error);
                    return res.json({ status: false, message: 'Không gửi được email' });
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
                return res.json({ status: false, message: 'Invalid data' });
            }

            const result = await verifyOtp(email, code);

            if (result) return res.json({ status: true, message: 'Xác thực thành công!' });

            res.json({ status: false, message: 'Xác thực thất bại!' });
        } catch (error) {
            next(error);
        }
    }

    async checkEmailAlreadyExists(req, res, next) {
        try {
            const email = req.body.email;
            if (!email) {
                return res.json({ status: false, message: 'Invalid data' });
            }
            const isEmailTaken = await checkEmailAlready(email);
            if (isEmailTaken) {
                return res.status(200).json({
                    status: true,
                    message: 'Email này tồn tại!',
                });
            }
            res.json({ status: false, message: 'Email không tôn tại!' });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.json({ status: false, message: 'Invalid data' });
            }
            const isEmailTaken = await checkEmailAlready(email);
            if (!isEmailTaken) {
                return res.json({ status: false, message: 'Email không tồn tại!' });
            }
            let user = await findUser({ email: email });
            let hashPass = await Util.hashPassword(password);
            if (user) {
                const checkPassword = await Util.verifyPassword(password, user.password);
                if (checkPassword) {
                    return res.json({
                        status: true,
                        message: 'Đăng nhập thành công!',
                        user: JSON.stringify(user),
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'Mật khẩu sai, vui lòng nhập lại!',
                    });
                }
            }
            return res.json({ status: false, message: 'Tài khoản không tồn tại!' });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { password, confirm_password, email } = req.body;
            if (!password || !confirm_password || !email) {
                return res.json({ status: false, message: 'Invalid data' });
            }
            const isEmailTaken = await checkEmailAlready(email);
            if (!isEmailTaken) {
                return res.json({
                    status: false,
                    message: 'Tài khoản không tồn tại!!',
                });
            }
            if (password !== confirm_password) {
                return res.json({
                    status: false,
                    message: 'Xác nhận mật khẩu không khớp !',
                });
            }
            let hashPassword = await Util.hashPassword(password);
            await updateUser({
                email: email,
                password: hashPassword,
            });
            res.json({
                status: true,
                message: 'Thay đổi mật khẩu thành công!',
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

    async getUserNotMember(req, res, next) {
        try {
            const { projectId } = req.query;
            const project = await getProject(projectId);

            if (project) {
                let listUserInProject = [];
                console.log(project);
                listUserInProject.push(project.createdBy);
                listUserInProject = [...listUserInProject, ...project.member];
                const condition = { _id: { $nin: listUserInProject } };
                const data = await findUsers(condition);
                if (data) {
                    res.json({
                        status: true,
                        data: JSON.stringify(data),
                    });
                }
            }
            res.json({
                status: false,
                message: 'error',
            });
        } catch (error) {
            next(error);
        }
    }

    async getId(req, res, next) {
        try {
            const { email, id } = req.body;
            if (!email && !id) {
                return res.json({ status: false, message: 'Invalid data!!' });
            }
            const result = await findUser({ email, id });
            if (result) {
                return res.json({
                    status: true,
                    message: 'successfully retrieved',
                    data: JSON.stringify(result),
                });
            }
            res.json({ status: false, message: 'Failed' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async createNewProfile(req, res, next) {
        try {
            const { fullName, address, roleWork, description, userId, phone_number } = req.body;
            if (!fullName || !address || !roleWork || !description || !userId || !phone_number) {
                return res.json({ status: false, message: 'Invalid data!!' });
            }

            const result = await create({
                full_name: fullName,
                role_work: roleWork,
                description,
                userInfo: userId,
                address,
                phone_number,
            });
            if (result) {
                return res.json({
                    status: true,
                    message: 'Create new profile successfully!',
                    profile: JSON.stringify(result),
                });
            }
            res.json({ status: false, message: 'Failed create profile!' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { fullName, address, roleWork, description, userId, phone_number, email } = req.body;
            if (!fullName || !address || !roleWork || !description || !userId || !phone_number || !email) {
                return res.json({ status: false, message: 'Invalid data!!' });
            }

            const profileUpdate = await update({
                full_name: fullName,
                role_work: roleWork,
                description,
                useInfo: userId,
                address,
                phone_number,
            });
            const result = await updateUserById(userId, {
                email: email,
            });
            console.log({
                result,
                profileUpdate,
            });
            console.log({
                result,
                profileUpdate,
            });
            if (result && profileUpdate) {
                return res.json({
                    status: true,
                    message: 'Update profile successfully!',
                    profile: JSON.stringify(profileUpdate),
                });
            }
            res.json({ status: false, message: 'Failed create profile!' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async checkProfileExist(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.json({ status: false, message: 'Invalid data!' });
            }
            const condition = { userInfo: userId };
            const data = await checkExist(condition);

            res.json({
                status: true,
                exist: data,
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.json({ status: false, message: 'Invalid data!' });
            }
            const condition = { userInfo: userId };
            const data = await findProfile(condition);

            res.json({
                status: true,
                data: JSON.stringify(data),
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAvatarUser(req, res, next) {
        try {
            const { userId, avatar } = req.body;
            if (!userId || !avatar) {
                return res.json({ status: false, message: 'Invalid data!' });
            }
            const data = await updateUserById(userId, {
                photoURL: avatar,
            });

            if (data) {
                res.json({
                    status: true,
                    message: 'Upload avatar successfully!',
                    data: JSON.stringify(data),
                });
            } else {
                res.json({
                    status: false,
                    message: 'Upload avatar failed!',
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async updateBackgroundProfile(req, res, next) {
        try {
            const { userId, background } = req.body;
            if (!userId || !background) {
                return res.json({ status: false, message: 'Invalid data!' });
            }
            const data = await upBackGround(userId, background);

            if (data) {
                res.json({
                    status: true,
                    message: 'Upload background successfully!',
                    data: JSON.stringify(data),
                });
            } else {
                res.json({
                    status: false,
                    message: 'Upload background failed!',
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
