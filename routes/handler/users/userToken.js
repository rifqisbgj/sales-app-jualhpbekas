const jwt = require("jsonwebtoken");
const { Users } = require("../../../models");

const { JWT_SECRET_REFRESH_TOKEN, JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } =
  process.env;

module.exports = async (req, res) => {
  const refreshToken = req.body.refresh_token;
  const email = req.body.email;

  if (!refreshToken || !email) {
    return res.status(400).json({ status: "error", message: "invalid token" });
  }

  const getUserToken = await Users.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!getUserToken) {
    return res.status(400).json({
      status: "error",
      message: "invalid token",
    });
  }

  jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: "error", message: err.message });
    }

    if (email !== decoded.data.email) {
      return res
        .status(400)
        .json({ status: "error", message: "email is not valid" });
    }

    const token = jwt.sign({ data: decoded.data }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
    });
    return res.json({
      status: "success",
      data: {
        token,
      },
    });
  });
};
