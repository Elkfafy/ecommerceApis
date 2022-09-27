//Require & Variables//
const userController = require("../app/controllers/userController");
const router = require("express").Router();
const { authAdmin, auth } = require("../app/middlewares/auth");
const upload = require("../app/middlewares/uploadFile");
//Routes//
//All
router.get("/me", auth, userController.me);
router.post("/register", upload.single("profilePic"), userController.register);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);
router.post("/logoutAll", auth, userController.logoutAll);
router.put("/edit", auth, upload.single("profilePic"), userController.editMe);
router.patch(
    "/changePic",
    auth,
    upload.single("profilePic"),
    userController.changePic
);
router.patch(
    "/changePic",
    auth,
    upload.single("profilePic"),
    userController.changePic
);
router.patch("/status", auth, userController.changeMyStatus);
router.patch("/changePass", auth, userController.changePass);
router.delete("/delete", auth, userController.deleteMe);
router.post('/address', auth, userController.addAddress)
router.put('/address/:id', auth, userController.editAddress)
router.delete('/address', auth, userController.deleteAddress)
router.post('/charge', auth, userController.charge)
router.post('/purchase', auth, userController.purchase)
//Admin
router.get("/all", auth, authAdmin, userController.all);
router.delete("/all/:id", auth, authAdmin, userController.delete);
router.post("/all/:id", auth, authAdmin, userController.edit);
router.get('/all/:id', auth, authAdmin, userController.single)
router.patch('/status/:id', auth, authAdmin, userController.changeStatus)
//Export
module.exports = router;
