const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const loc = path.join(__dirname, "../public");
        cb(null, loc);
    },
    filename: function (req, file, cb) {
        const filename =
            file.fieldname +
            Date.now() +
            path.extname(file.originalname).toLowerCase();
        cb(null, filename);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 200000000 },
});

module.exports = upload;
