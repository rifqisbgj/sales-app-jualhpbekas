const bcrypt = require("bcrypt");
const { Users, sequelize } = require("../../../models");
const { v1: uuidv1 } = require("uuid");
const Validator = require("fastest-validator");
const logger = require("../../../helper/logger");
// kustom validasi jika terdapat error
const valid = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    required: "{field} tidak boleh kosong",
    stringMin: "{field} harus berisi minimal {expected} digit",
    email: "{field} harus berisi format email yang benar",
    enumValue: "{field} harus berisi nilai {expected}",
  },
});

module.exports = async (req, res) => {
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  const schema = {
    name: "string|empty:false",
    email: "email|empty:false",
    password: "string|min:6",
    role: { type: "enum", values: ["super", "adminQC", "adminSale"] },
    created_by: "email|empty:false",
  };

  // cek inputan dengan schema pengecekan yang telah diberikan
  const validate = valid.validate(req.body, schema);

  // if validate have an array it's mean error
  if (validate.length) {
    // add error log create user
    childLogger.error(`Gagal menambahkan pengguna, format input salah`, {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }
  // find email exists
  const user = await Users.findOne({
    where: {
      email: sequelize.where(
        sequelize.fn("lower", sequelize.col("email")),
        req.body.email.toLowerCase()
      ),
    },
  });

  // // get uuid createdBy
  const createdBy = await Users.findOne({
    where: { email: req.body.created_by },
  });

  // jika user sudah tersedia
  if (user) {
    // add error log create user
    childLogger.error(
      `Gagal menambahkan pengguna, email ${req.body.email} sudah tersedia`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.status(409).json([
      {
        status: "error",
        message: "email already exists",
      },
    ]);
  }

  // bcrypt password dengan data password yang diinputkan user
  const password = await bcrypt.hash(req.body.password, 10);

  // masukan data yg telah diinputkan user ke container data
  const data = {
    // generate uuid v1 dan inputkan sebagai data kolom id
    id: uuidv1(),
    password,
    nama: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    role: req.body.role,
    created_by: createdBy.id,
  };

  // create user
  const createUser = await Users.create(data);
  // add info log success create user
  childLogger.info(
    `Berhasil menambahkan pengguna, dengan email: ${req.body.email}`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  // res if success
  return res.json({
    status: "success",
    data: createUser,
  });
};
