// set value pada dotenv sebagai config keseluruhan
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const brandRouter = require("./routes/brand");
const varianRouter = require("./routes/varian");
const productRouter = require("./routes/product");
const imagesProductRouter = require("./routes/imagesProduct");
const qcRouter = require("./routes/qualityControl");
const usersRouter = require("./routes/users");

const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));

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
