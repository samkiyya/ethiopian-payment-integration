const buildUserRepository = ({ userModel, userProfileModel }) => {
  const serialize = (instance) => {
    if (!instance) return null;
    const json = instance.toJSON();
    delete json.passwordHash;
    return json;
  };

  const createUser = async (payload) => {
    const user = await userModel.create(payload);
    await userProfileModel.create({ userId: user.id });
    return serialize(user);
  };

  const findByEmail = async (email) => {
    const user = await userModel.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  };

  const findById = async (id) => {
    const user = await userModel.findByPk(id);
    return serialize(user);
  };

  const updateLastLogin = async (userId) => {
    await userProfileModel.updateOne(
      { userId },
      { $set: { lastLoginAt: new Date() } },
      { upsert: true }
    );
  };

  return {
    createUser,
    findByEmail,
    findById,
    updateLastLogin
  };
};

module.exports = buildUserRepository;
