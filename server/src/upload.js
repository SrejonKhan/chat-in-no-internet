const multer = require("multer");
const path = require("path");

const filetypeBlacklist = ["text/html"];

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.CDN_LOCAL_PATH);
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      cb(null, Date.now() + "-" + file.originalname.replace(extname, "") + extname);
    },
  }),
  limits: {
    fileSize: process.env.CDN_MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (filetypeBlacklist.includes(file.mimetype)) {
      return cb(new Error("File type not allowed."), false);
    }
    cb(null, true);
  },
});

const uploadController = (req, res, next) => {
  try {
    return res.send({
      url: new URL(`${process.env.CDN_URL}/${req.file?.filename}`).toString(),
      mime: req.file?.mimetype,
      filename: req.file?.filename,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMiddleware, uploadController };
