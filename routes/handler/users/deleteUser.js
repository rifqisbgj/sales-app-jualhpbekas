const { Users } = require("../../../models");

module.exports = async (req, res) => {
  // get uuid createdBy
  const user = await Users.findOne({
    where: { email: req.body.email },
    include: "produkQCByAdmin",
  });

  //   jika user memiliki keterkaitan dengan hasil QC
  if (user.produkQCByAdmin.length) {
    return res.status(409).json([
      {
        status: "error",
        message: "Admin memiliki keterkaitan pada Hasil QC",
      },
    ]);
  }
  //   // hapus user
  await user.destroy({ where: { id: user.id } });

  //   //   mengembalikan res ketika selesai dihapus
  return res.json({ status: "success", message: "Akun berhasil dihapus" });
};
