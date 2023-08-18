const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    role_work: {
        type: String,
    },
    description: {
        type: String,
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    background: {
        type: String,
        default: '',
    },
    createdAt: { type: Date, default: Date.now },
    is_blocked: { type: Boolean, default: false },
});

const Profile = mongoose.model('Profile', profileSchema);

const create = async (data) => {
    try {
        const checkExist = await Profile.find({
            userInfo: data.userInfo,
        });

        if (checkExist.length > 0) {
            return false;
        }
        const profile = await new Profile(data);
        return profile.save();
    } catch (error) {
        console.error('Error create profile:', error);
        throw error;
    }
};
const update = async (data) => {
    try {
        const update = await Profile.findOneAndUpdate(
            {
                userInfo: data.userInfo,
            },
            data,
            { new: true },
        );
        return update;
    } catch (error) {
        console.error('Error create profile:', error);
        throw error;
    }
};
const checkExist = async (condition) => {
    try {
        const profile = await Profile.find(condition);

        if (profile.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error create profile:', error);
        throw error;
    }
};

const findProfile = async (condition) => {
    try {
        const profile = await Profile.findOne(condition);
        return profile;
    } catch (error) {
        console.error('Error create profile:', error);
        throw error;
    }
};

const upBackGround = async (userId, background) => {
    try {
        const update = await Profile.findOneAndUpdate(
            {
                userInfo: userId,
            },
            {
                background: background,
            },
            { new: true },
        );
        console.log(update);
        return update;
    } catch (error) {
        console.error('Error create profile:', error);
        throw error;
    }
};
module.exports = {
    create,
    checkExist,
    findProfile,
    update,
    upBackGround,
};
