const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // // 1- Diskstorage => use to not process the image
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     // category-${id}-Date.now().jpeg
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  // 2-) MemoryStorage enige =>buffer
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only Image allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
/////////////////////
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
