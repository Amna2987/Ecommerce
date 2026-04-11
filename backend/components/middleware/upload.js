const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = path
      .parse(file.originalname)
      .name.toLocaleLowerCase()
      .replace(/\s+/g, "-");

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    return {
      folder: "mern_uploads",
      public_id: `${originalName}-${uniqueSuffix}`,
      resource_type: "image",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
