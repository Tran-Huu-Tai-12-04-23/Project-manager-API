const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expirationTime: { type: Date, required: true },
});
otpSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

const createNewOtp = async (email, otp) => {
  try {
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + 60);

    const newOtp = new Otp({
      email: email,
      code: otp,
      expirationTime: expirationTime,
    });
    await newOtp.save();
    return newOtp;
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const count = await Otp.countDocuments({ email: email, code: otp });
    return count > 0;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

module.exports = {
  Otp,
  createNewOtp,
  verifyOtp,
};
