const { Op } = require("sequelize");
const { Users } = require("../../../models");

module.exports = async (req, res) => {
  const namaAdmin = req.query.name_user || [];
  const sqlOptions = {
    attributes: ["id", "nama", "email", "role", "avatar"],
  };

  if (namaAdmin.length) {
    sqlOptions.where = {
      [Op.or]: [{ nama: { [Op.like]: "%" + namaAdmin + "%" } }],
    };
  }

  const users = await Users.findAll(sqlOptions);

  return res.json({
    status: "success",
    data: users,
  });
};
