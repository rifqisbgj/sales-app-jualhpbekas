const { Merek, sequelize } = require("../../../models");
const Validator = require("fastest-validator");
const { where } = require("sequelize");
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "Nama merk tidak boleh kosong",
  },
});
module.exports = async (req, res) => {
  // console.log(req.body.namamerek);
  const schema = {
    namamerek: "string|empty:false",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  const data = {
    namamerek: req.body.namamerek,
  };

  const isMerekExist = await Merek.findOne({
    where: {
      namamerek: sequelize.where(
        sequelize.fn("lower", sequelize.col("namamerek")),
        "LIKE",
        "%" + req.body.namamerek.toLowerCase() + "%"
      ),
    },
  });

  if (isMerekExist) {
    return res.status(409).json({
      status: "error",
      message: "Merek sudah tersedia",
    });
  }

  const merek = await Merek.create(data);
  return res.json({
    status: "success",
    data: merek,
  });
};
