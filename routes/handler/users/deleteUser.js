const { Users } = require("../../../models");
const logger = require("../../../helper/logger");

module.exports = async (req, res) => {
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  // get uuid createdBy
  const user = await Users.findOne({
    where: { email: req.body.email },
    include: "produkQCByAdmin",
  });

  //   jika user memiliki keterkaitan dengan hasil QC
  if (user.produkQCByAdmin.length) {
    // add error log delete user
    childLogger.error(
      `Gagal menghapus pengguna dengan email: ${user.email}, user memiliki keterkaitan dengan hasil QC`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.status(409).json([
      {
        status: "error",
        message: "Admin memiliki keterkaitan pada Hasil QC",
      },
    ]);
  }
  //   // hapus user
  await user.destroy({ where: { id: user.id } });
  // add error log delete user
  childLogger.warn(
    `Berhasil menghapus pengguna dengan email: ${req.body.email}`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );

  //   //   mengembalikan res ketika selesai dihapus
  return res.json({ status: "success", message: "Akun berhasil dihapus" });
};
