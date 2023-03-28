const createProduct = require("./createProduct");
const updateProduct = require("./updateProduct");
const detailProduct = require("./detailProduct");
const getAllProduct = require("./getAllProduct");
const getProductAdmin = require("./getProductAdmin");
const deleteProduct = require("./deleteProduct");
const getProductByCode = require("./getProductByCode");

module.exports = {
  getProductAdmin,
  createProduct,
  updateProduct,
  detailProduct,
  getAllProduct,
  deleteProduct,
  getProductByCode,
};
