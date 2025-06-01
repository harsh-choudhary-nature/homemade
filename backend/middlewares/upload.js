const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../configs/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profiles", // optional folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
