const { Users, sequelize } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");
const Validator = require("fastest-validator");
const valid = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    required: "{field} tidak boleh kosong",
    email: "{field} harus berisi format email yang benar",
    enumValue: "{field} harus berisi nilai {expected}",
  },
});

module.exports = async (req, res) => {
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json([{ status: "error", message: "Invalid user identity" }]);

  const schema = {
    name: "string|empty:false",
    email: "email|empty:false",
    avatar: "string|optional",
    role: { type: "enum", values: ["super", "adminQC", "adminSale"] },
  };

  const validate = valid.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  const id = req.params.id;
  const user = await Users.findByPk(id);
  if (!user) {
    return res.status(404).json([
      {
        status: "error",
        message: "user not found",
      },
    ]);
  }

  const email = req.body.email;
  if (email) {
    const checkEmail = await Users.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("lower", sequelize.col("email")),
          email.toLowerCase()
        ),
      },
    });

    if (checkEmail && email != user.email) {
      return res.status(409).json([
        {
          status: "error",
          message: "email already exist",
        },
      ]);
    }
  }

  await user.update({
    nama: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    role: req.body.role,
  });

  return res.json({
    status: "success",
    data: { user },
  });
};
