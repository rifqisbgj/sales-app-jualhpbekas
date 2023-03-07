const jwt = require("jsonwebtoken");
const { Users } = require("../../../models");

const { JWT_SECRET_REFRESH_TOKEN, JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } =
  process.env;

module.exports = async (req, res) => {
  // ambil refreshToken dari cookies
  const refreshToken = req.cookies.refreshToken;
  // jika refreshToken tidak tersedia
  if (!refreshToken) {
    return res.status(400).json({ status: "error", message: "invalid token" });
  }
  // cek user dengan refreshToken tsb..
  const getUserToken = await Users.findOne({
    where: { refresh_token: refreshToken },
  });

  // jika userToken tidak ditemukan
  if (!getUserToken) {
    return res.status(400).json({
      status: "error",
      message: "invalid token",
    });
  }

  // verify kebenaran data refreshToken dengan kunci pada JWT_SECRET_REFRESH_TOKEN
  jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
    // jika terdapat err pada pengecekan
    if (err) {
      return res.status(403).json({ status: "error", message: err.message });
    }

    // buat token dengan data sesuai dengan apa yang ada pada refreshToken
    // kemudian kunci dengan JWT_SECRET
    const token = jwt.sign({ data: decoded.data }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
    });

    // jika berhasil, maka kembalikan res dengan isi token
    return res.json({
      status: "success",
      data: {
        token,
      },
    });
  });
};
