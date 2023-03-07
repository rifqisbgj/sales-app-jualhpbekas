const { Users } = require("../../../models");

module.exports = async (req, res) => {
  const email = req.body.email;
  // ambil 1 data user dengan email sesuai req
  const user = await Users.findOne({ where: { email: email } });

  // jika user tidak ditemukan
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }
  // update refreshToken menjadi kosong, setelah logout
  await Users.update({ refresh_token: null }, { where: { email: email } });

  // hapus cookis refreshToken dari web
  res.clearCookie("refreshToken");
  return res.json({
    status: "success",
    message: "Logout Success",
  });
};
