const { Users, sequelize } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");
const Validator = require("fastest-validator");
const logger = require("../../../helper/logger");
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
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json([{ status: "error", message: "Invalid user identity" }]);

  const id = req.params.id;
  const user = await Users.findByPk(id);
  if (!user) {
    // add error log update user
    childLogger.error(`Gagal memperbarui pengguna, pengguna tidak tersedia`, {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(404).json([
      {
        status: "error",
        message: "user not found",
      },
    ]);
  }
  const schema = {
    name: "string|empty:false",
    email: "email|empty:false",
    avatar: "string|optional",
    role: { type: "enum", values: ["super", "adminQC", "adminSale"] },
  };

  const validate = valid.validate(req.body, schema);
  if (validate.length) {
    // add error log update user
    childLogger.error(
      `Gagal memperbarui pengguna dengan email ${user.email}, format input salah`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.status(400).json({
      status: "error",
      message: validate,
    });
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
      // add error log update user
      childLogger.error(
        `Gagal memperbarui pengguna dengan email ${user.email}, email sudah tersedia`,
        {
          method: req.method,
          url: req.originalUrl,
        }
      );
      return res.status(409).json([
        {
          status: "error",
          message: "email already exist",
        },
      ]);
    }
  }

  const tempEmail = user.email;

  await user.update({
    nama: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    role: req.body.role,
  });
  // add info log success update user
  childLogger.info(`Berhasil memperbarui pengguna dengan email ${tempEmail}`, {
    method: req.method,
    url: req.originalUrl,
  });
  return res.json({
    status: "success",
    data: { user },
  });
};
