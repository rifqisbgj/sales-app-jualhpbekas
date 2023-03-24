const bcrypt = require("bcrypt");
const { Users } = require("../../../models");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const logger = require("../../../helper/logger");
const {
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_EXPIRED,
} = process.env;
const valid = new Validator();

module.exports = async (req, res) => {
  const schema = {
    email: "email|empty:false",
    password: "string|min:6",
  };

  const validate = valid.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // check user exist
  const user = await Users.findOne({
    where: { email: req.body.email },
  });

  // check if user doesn't exist
  if (!user) {
    // add error log login
    logger.error("Gagal login, email atau password salah", {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(404).json({
      status: "error",
      message: "Email atau password salah",
    });
  }

  // compare password to check same or not
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    // add error log login
    logger.error("Gagal login, email atau password salah", {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(404).json({
      status: "error",
      message: "Email atau password salah",
    });
  }

  // container dataUser
  const dataUser = {
    email: user.email,
    nama: user.nama,
    avatar: user.avatar,
    role: user.role,
    id: user.id,
  };

  // create accessToken
  const accessToken = jwt.sign({ data: dataUser }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
  });
  // create refreshToken
  const refreshToken = jwt.sign({ data: dataUser }, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
  });

  // update refresh token to table user
  await user.update({ refresh_token: refreshToken });

  // set refreshToken ke cookies
  res.cookie("refreshToken", refreshToken, {
    // hanya menerikan req dari http
    httpOnly: true,
    // set masa berlaku cookies
    maxAge: 24 * 60 * 60 * 1000,
  });

  // add info success login
  logger.info(
    `Berhasil login dengan email: ${user.email} | role: ${user.role}`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  return res.json({
    status: "success",
    data: {
      accessToken,
    },
  });
};
