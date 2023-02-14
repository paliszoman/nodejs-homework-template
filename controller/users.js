const service = require("./../service/users");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("./../service/schemas/user.js");
const { JWT_SECRET } = require("./../config");
const { editAvatar } = require("./../utils/editAvatar.js");
const { avatarDir } = require("./../middleware/files");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/verifyMail");

const getAll = async (req, res, next) => {
  try {
    const results = await User.find();
    res.status(200).json(results);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await service.getUser({ email });
  const verToken = uuidv4();

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  try {
    const avatarURL = gravatar.url(email, { s: "250", d: "mp" });
    const newUser = new User({ email, avatarURL, verificationToken: verToken });
    newUser.setPassword(password);
    await newUser.save();
    await sendMail(email, verToken);
    res.status(201).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await service.getUser({ email });

    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!user.verify)
      return res.status(401).json({
        message: "User is not verified, please click verification link",
      });

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    await service.updateUser(user.id, { token });
    res
      .status(200)
      .json({ token, user: { email, subscription: user.subscription } });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await service.getUser({ _id: req.user._id });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await service.updateUser(user.id, { token: null });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = user;
    const user = await service.getUser({ token: req.user.token });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(200).json({ email, subscription });
  } catch (err) {
    next(err);
  }
};

const newAvatar = async (req, res, next) => {
  try {
    const { path: tmpPath, filename } = req.file;
    const avatarURL = path.join(avatarDir, filename);
    editAvatar(tmpPath, avatarURL);
    await fs.unlink(tmpPath);
    const user = await service.getUser({ token: req.user.token });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const newUser = await service.updateUser(user.id, { avatarURL });
    res.status(200).json({ avatarURL: newUser.avatarURL });
  } catch (err) {
    const { path: tmpPath } = req.file;
    await fs.unlink(tmpPath);
    next(err);
  }
};

const verificationLink = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await service.getUser({ verificationToken });
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndUpdate(
      user.id,
      { verify: true, verificationToken: null },
      { new: true }
    );
    res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

const repeatVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "missing required field email" });
    const user = await service.getUser({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verify)
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });

    await sendMail(email, user.verificationToken);
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  getAll,
  login,
  logout,
  current,
  newAvatar,
  verificationLink,
  repeatVerification,
};
