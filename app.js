// set value pada dotenv sebagai config keseluruhan
require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var brandRouter = require("./routes/brand");
var varianRouter = require("./routes/varian");
var productRouter = require("./routes/product");
var imagesProductRouter = require("./routes/imagesProduct");
var qcRouter = require("./routes/qualityControl");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/brand", brandRouter);
app.use("/varian", varianRouter);
app.use("/product", productRouter);
app.use("/product-image", imagesProductRouter);
app.use("/qc", qcRouter);
app.use("/users", usersRouter);

module.exports = app;
