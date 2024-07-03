const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
    index: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  try {
    return await bcrypt.compare(plainPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;

  try {
    await user.save();
    return user;
  } catch (err) {
    throw new Error(`Token generation failed: ${err.message}`);
  }
};

userSchema.statics.findByToken = async function (token) {
  try {
    const decoded = jwt.verify(token, "secretToken");
    return await this.findOne({ _id: decoded, token: token });
  } catch (err) {
    throw new Error(`Token verification failed: ${err.message}`);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
