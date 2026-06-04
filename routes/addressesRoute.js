const express = require("express");

const authenService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressesService");

const router = express.Router();

router.use(authenService.protect, authenService.allowedTo("user"));
// Routes
router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
