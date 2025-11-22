const { Schema, model, models } = require('mongoose');

const UserProfileSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    lastLoginAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

const getUserProfileModel = () => models.UserProfile || model('UserProfile', UserProfileSchema);

module.exports = getUserProfileModel;
