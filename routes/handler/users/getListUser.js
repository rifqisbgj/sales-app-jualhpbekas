const { Op } = require("sequelize");
const { Users } = require("../../../models");

module.exports = async (req, res) => {
  // mengambil daftar pengguna/admin berdasarkan query
  const namaAdmin = req.query.name_user || [];

  // ambil data dengan antribut yang telah ditentukan
  const sqlOptions = {
    attributes: ["id", "nama", "email", "role", "avatar", "createdAt"],
  };

  // jika terdapat nilai searching user
  if (namaAdmin.length) {
    sqlOptions.where = {
      [Op.or]: [{ nama: { [Op.like]: "%" + namaAdmin + "%" } }],
      role: { [Op.not]: "super" },
    };
  }

  // ambil user tanpa role super
  sqlOptions.where = {
    role: { [Op.not]: "super" },
  };

  // mengambil seluruh data user sesuai dengan sqlOptions
  const users = await Users.findAll(sqlOptions);

  return res.json({
    status: "success",
    data: users,
  });
};
