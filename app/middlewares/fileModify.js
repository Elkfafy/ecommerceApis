const path = require("path");
const fs = require("fs");
const fileModify = (req, res, next) => {
    if (req.file) {
        const ext = path.extname(req.file.originalname);
        fs.renameSync(req.file.path, req.file.path + ext);
        req.file.path = req.file.path + ext;
        req.file.filename = req.file.filename + ext;
    }
    next();
};
module.exports = fileModify;
