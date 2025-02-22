const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Taskpulse", // Cloudinary folder name
    resource_type: "raw", // Ensure it is treated as a raw file (not an image)
    format: async (req, file) => "pdf", // Enforce .pdf format
    public_id: (req, file) => file.originalname.split(".")[0], // Keep original filename
  },
});

const upload = multer({ storage });

module.exports = upload;
