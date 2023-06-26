const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  password: { type: String },
  email: { type: String },
  photoURL: { type: String },
  displayName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

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

const updateUser = async (user) => {
  try {
    const { email, password, ...updateData } = user;

    // If a new password is provided, hash it before updating
    if (password) {
      updateData.password = password;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      updateData,
      { new: true }
    );

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
    console.error("Error checking email in User collection:", error);
    throw error;
  }
};

const findUser = async (condition) => {
  try {
    const res = await User.findOne({ ...condition });
    return res;
  } catch (error) {
    console.error("Error checking email in User collection:", error);
    throw error;
  }
};
const findUsers = async ({ condition }) => {
  try {
    const res = await User.find({ ...condition });
    return res;
  } catch (error) {
    console.error("Error checking email in User collection:", error);
    throw error;
  }
};

module.exports = {
  User,
  findUsers,
  findUser,
  createNewUser,
  updateUser,
  checkEmailAlready,
};
