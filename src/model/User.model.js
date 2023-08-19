const Util = require('../help/index');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    password: { type: String },
    email: { type: String },
    photoURL: { type: String },
    displayName: { type: String },
    isLoginOtherPlatform: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('user', userSchema);

const createNewUser = async (user) => {
    try {
        const newUser = new User({ ...user });
        const res = await newUser.save();
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const updateUser = async (condition, newData) => {
    try {
        const updatedUser = await User.findOneAndUpdate(condition, newData, { new: true });

        return updatedUser;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const updateUserById = async (userId, dataUpdate) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, dataUpdate, { new: true });
        return updatedUser;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const checkEmailAlready = async (email) => {
    try {
        const count = await User.countDocuments({ email: email });
        return count > 0;
    } catch (error) {
        console.error('Error checking email in User collection:', error);
        throw error;
    }
};

const findUser = async (data) => {
    try {
        const res = await User.findOne({
            $or: [{ email: data.email }, { id: data.id }],
        });
        return res;
    } catch (error) {
        console.error('Error checking email or id in User collection:', error);
        throw error;
    }
};
const findUsers = async (condition) => {
    try {
        const res = await User.find({ ...condition });
        return res;
    } catch (error) {
        console.error('Error checking email in User collection:', error);
        throw error;
    }
};

const verifyPassword = async (password, userId) => {
    {
        try {
            const res = await User.findOne({ _id: userId });
            const hashPass = res.password;
            const verify = await Util.verifyPassword(password, hashPass);
            return verify;
        } catch (error) {
            console.error('Error checking email in User collection:', error);
            throw error;
        }
    }
};

module.exports = {
    User,
    findUsers,
    findUser,
    createNewUser,
    updateUser,
    checkEmailAlready,
    updateUserById,
    verifyPassword,
};
