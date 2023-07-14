const mongoose = require("mongoose");
const Util = require('./../help/index')

const LinkInviteSchema = new mongoose.Schema({
  inviter: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  projectId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
  token: {type: String, required: true},
  createdAt: { type: Date, required: true, default: Date.now() },
  expiresAt: { type: Date, default: Date.now() + (24 * 60 * 60 * 1000) } // Thêm trường expiresAt và đặt giá trị mặc định
});

LinkInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Tạo một index và cấu hình tự động xóa khi hết hạn

const LinkInvite = mongoose.model('LinkInvite', LinkInviteSchema);


const createAuthenInviteMember = async (inviter, projectId) => {
  try {
    const token = await Util.generateVerificationCode(inviter + projectId);
    const newLink = new LinkInvite({
      inviter: inviter,
      projectId: projectId,
      token: token,
    });
    const result = await newLink.save();
    return result;
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
};

const findLink = async (token) => {
  try {
    const tokenFind = await LinkInvite.findOne({token: token});
    return tokenFind;
  } catch (error) {
    console.error("Error creating OTP:", error);
    throw error;
  }
}



module.exports = {
  LinkInvite,
  createAuthenInviteMember,
  findLink
};
