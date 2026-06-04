const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");
const {
  signup,
  login,
  forgotpassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

// Routes
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotpassword);
router.post("/verifyResetCode", verifyPassResetCode);

router.put("/resetPassword", resetPassword);

module.exports = router;
