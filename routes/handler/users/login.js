const bcrypt = require("bcrypt");
const { Users } = require("../../../models");
const Validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
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
    return res.status(409).json({
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
    return res.status(404).json({
      status: "error",
      message: "Email atau password salah",
    });
  }

  // compare password to check same or not
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(404).json({
      status: "error",
      message: "Email atau password salah",
    });
  }

  // create accessToken
  const accessToken = jwt.sign({ data: user }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
  });
  // create refreshToken
  const refreshToken = jwt.sign({ data: user }, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
  });

  // update refresh token to table user
  await user.update({ refresh_token: refreshToken });

  return res.json({
    status: "success",
    data: {
      accessToken,
      refreshToken,
    },
  });
};
