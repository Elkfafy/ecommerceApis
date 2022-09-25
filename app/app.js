// Requirements & Variables
require("dotenv").config();
require("./database/connection");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const categoryRoutes = require("../routes/categoryRoutes");

//Setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);

//Export
module.exports = app;
