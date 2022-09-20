//Modules & variables
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require('fs')
const path = require('path')
//Schema
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 30,
            required: true,
        },
        age: {
            type: Number,
            min: 10,
            max: 150,
            validate: function () {
                if (!this.value) this.value = 10;
            },
        },
        email: {
            type: String,
            trim: true,
            minLength: 3,
            maxLength: 30,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 150,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        userType: {
            type: String,
            trim: true,
            enum: ["consumer", "vendor", "admin"],
            required: true,
        },
        image: {
            type: String,
            trim: true,
            minLength: 1,
            maxLength: 300,
            default: "userDefault.png",
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                    unique: true,
                },
            },
        ],
    },
    { timeStamp: true }
);
//Pre
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
});

//Methods
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.__v;
    delete user.tokens;
    return user;
};
userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.token);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};
userSchema.methods.changePic = async function (file) {
    const user = this;
    const oldPic = user.image === "userDefault.png" ? null : user.image;
    user.image = file.filename;
    await user.save();
    if (oldPic) fs.unlinkSync(path.join(__dirname, "../../public", oldPic));
};
//Statics
userSchema.statics.checkPassword = function (password, hash) {
    return bcrypt.compare(password, hash);
};
userSchema.statics.login = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Invalid Email");
    if (!userModel.checkPassword(password, user.password))
        throw new Error("Invalid Password");
    const token = await user.generateToken();
    return { user, token };
};
//Export
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
