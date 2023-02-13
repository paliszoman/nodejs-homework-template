const express = require("express");
const router = express.Router();
const user = require("../../controller/users.js");
const avatar = require("./../../middleware/files");

const { userValidator } = require("./../../utils/validationUsers");
const { auth, isValid } = require("./../../middleware/auth");

router.post("/signup", isValid(userValidator), user.register);

router.post("/login", isValid(userValidator), user.login);

router.get("/logout", auth, user.logout);

router.get("/current", auth, user.current);

router.get("/", user.getAll);

router.patch("/avatars", auth, avatar.newFile.single("avatar"), user.newAvatar);

router.get("/verify/:verificationToken", user.verificationLink);

router.post("/verify", isValid(userValidator), user.repeatVerification);

module.exports = router;
