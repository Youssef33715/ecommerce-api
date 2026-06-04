const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword, //look
  getLoggedUserData,
  updataLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");
const authenService = require("../services/authService");

const router = express.Router();

router.use(authenService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updataLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Routes
//Admin
router.use(authenService.allowedTo("admin", "manager"));
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
); //focus

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
