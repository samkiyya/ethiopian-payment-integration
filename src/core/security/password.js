const argon2 = require('argon2');

const hashPassword = async (plain) => argon2.hash(plain, { type: argon2.argon2id });

const verifyPassword = async (plain, hash) => argon2.verify(hash, plain);

module.exports = {
  hashPassword,
  verifyPassword
};
