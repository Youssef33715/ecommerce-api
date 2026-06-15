const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanitizeData");

const User = require("../models/userModel");

//@ desc Signup
//@ route Get /api/v1/auth/signup
// @acess piblic
exports.signup = asyncHandler(async (req, res, next) => {
  //1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2- Generate token
  const token = createToken(user._id);
  res.status(201).json({ data: sanitizeUser(user), token });
});
//@ desc Login
//@ route Get /api/v1/auth/login
// @acess piblic

exports.login = asyncHandler(async (req, res, next) => {
  //1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    //focus
    return next(new ApiError("Incorrect email or password", 401));
  }
  const updatedUser = await User.findById(user._id);
  //3) Generate token
  const token = createToken(updatedUser._id);
  //Delete password from response
  delete updatedUser._doc.password;
  //4) send response to client side
  res.status(200).json({ data: sanitizeUser(updatedUser), token });
});
/////////////////
// @ desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route",
        401,
      ),
    );
  }
  // 2) verify token (no change happens,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }
  // 4) check if user change this password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    //password changed after token created (error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed this password, please login again..",
          401,
        ),
      );
    }
  }
  req.user = currentUser; //add user in request
  next();
});
/////////////(==Authencation is Done)
/// Authorization is Start
//['admin,manager'] (User permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1) access roles
    //2) acess registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403),
      );
    }
    next();
  });
/////
//@ desc Forgot password
//@ route post /api/v1/auth/forgotpassword
// @acess piblic
exports.forgotpassword = asyncHandler(async (req, res, next) => {
  //1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404),
    );
  }
  //2) if user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256") //Alogoriszm
    .update(resetCode)
    .digest("hex"); //represnt the output format
  // save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to the password on your E-shop Account.\n ${resetCode} \n Enter this code to complete the reset. \n thanks for helping us keep your account secure.\n`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});
/////////
//@ desc verify password
//@ route post /api/v1/auth/verifyResetcode
// @acess piblic

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset Code
  const hashedResetCode = crypto
    .createHash("sha256") //Alogoriszm
    .update(req.body.resetCode)
    .digest("hex"); //represnt the output format
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});
/////////
//@ desc Reset password
//@ route post /api/v1/auth/resetPassword
// @acess piblic
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404),
    );
  }
  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();
  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
