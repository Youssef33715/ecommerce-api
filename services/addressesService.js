const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//@ desc Add address to user addresses list
//@ route Post /api/v1/addresses
// @acess protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  //$addToSet => add Address object to user addresses array if productId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Address added successfully .",
    date: user.addresses,
  });
});
////////////////
//@ desc Remode address from addresses
//@ route delete /api/v1/addressesId
// @acess protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  //$pull => remove Address object from Addresses list array if AddressId  exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Address removed successfully .",
    date: user.addresses,
  });
});
////////////////
//@ desc Get logged user  addresses
//@ route Get /api/v1/addresses
// @acess protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "Success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
