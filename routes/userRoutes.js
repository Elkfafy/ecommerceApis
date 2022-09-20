//Require & Variables//
const userController = require("../app/controllers/userController");
const router = require("express").Router();
const { authAdmin, auth } = require("../app/middlewares/auth");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "../app/public") });
const fileModify = require('../app/middlewares/fileModify');
//Routes//
//All
router.get('/me', auth, userController.me)
router.post("/register", upload.single('profilePic'), fileModify,userController.register);
router.post("/login", userController.login);
router.post('/logout', auth, userController.logout)
router.post('/logoutAll', auth, userController.logoutAll)
router.put('/edit', auth, upload.single("profilePic"), fileModify, userController.editMe)
router.patch(
    "/changePic",
    auth,
    upload.single("profilePic"),
    fileModify,
    userController.changePic
    );
router.patch('/changePic', auth, upload.single("profilePic"), fileModify, userController.changePic)
router.patch('/changeStatus', auth, userController.changeMyStatus)
router.patch('/changePass', auth, userController.changePass)
router.delete('/delete', auth, userController.deleteMe)
//Admin
router.get("/all", auth, authAdmin, userController.all);
router.delete('/delete/:id', authAdmin, userController.delete)
router.edit('/edit/:id', authAdmin, )

//Export
module.exports = router;
