const { Users } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const valid = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    required: "{field} tidak boleh kosong",
    stringMin: "{field} harus berisi minimal {expected} digit",
  },
});

module.exports = async (req, res) => {
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user identity" });

  const schema = {
    password: "string|min: 6|empty:false",
    confirm_password: "string|min: 6|empty:false",
  };

  const user = await Users.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  const validate = valid.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  //   check new password and confirm password is same
  if (req.body.password !== req.body.confirm_password) {
    return res
      .status(400)
      .json({ status: "error", message: "Confirm password does'nt match" });
  }

  const password = await bcrypt.hash(req.body.password, 10);

  await user.update({ password });

  return res.json({ status: "success", message: "Password success updated" });
};
