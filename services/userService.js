const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

//upload Single image
exports.uploadUserImage = uploadSingleImage("profileImg");
//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //image processing
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our Data base
    req.body.profileImg = filename;
  }
  next();
});

//@ desc Get list of users
//@ route Get /api/v1/users
// @acess private
exports.getUsers = factory.getAll(User);
////////////////////////////////////////////
// @desc Get Specific user by id
// @route Get /api/v1/users/:id
// @access private
exports.getUser = factory.getOne(User);

//@desc createUser
//@route post /api/v1/user
//@access private

exports.createUser = factory.createOne(User);
/////////////////////////////////////////
//@desc Update specific user
//@route Put /api/v1/users/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      // update All expect password
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No Brand for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
///////////////////////////
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No Brand for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
////////////////////////////////////////////////
//@desc Delete specific user
//@route Delete /api/v1/users/:id
//@access private
exports.deleteUser = factory.deleteOne(User);

///////////(The User is already sigup)=>Sevices User Singup
//@desc Get Logged User data
//@route Delete /api/v1/users/getMe
//@access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
///////////
//@desc Updata Logged User password
//@route Put /api/v1/users/updataMyPassword
//@access private/protect
exports.updataLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //1) Updata user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  //2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});
///////////
//@desc Updata Logged User data (without password,role)
//@route Put /api/v1/users/updataMe
//@access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );
  res.status(200).json({ data: updateUser });
});
///////////
//@desc Deactivate Logged User
//@route Delete /api/v1/users/deleteMe
//@access private/protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});
