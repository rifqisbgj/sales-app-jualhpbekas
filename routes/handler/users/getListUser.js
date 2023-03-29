const { Op } = require("sequelize");
const { Users } = require("../../../models");

module.exports = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const roleAdmin = req.query.role || "";

  const sqlFilter = {};
  if (roleAdmin !== "") {
    sqlFilter.role = roleAdmin;
  }

  const sqlOptions = {
    where: {
      [Op.or]: [
        { nama: { [Op.iLike]: "%" + search + "%" } },
        { email: { [Op.iLike]: "%" + search + "%" } },
      ],
      [Op.and]: [sqlFilter],
      [Op.not]: [{ id: req.user.data.id }],
    },
  };

  const totalRows = await Users.count(sqlOptions);
  const totalPage = Math.ceil(totalRows / limit);

  sqlOptions.offset = offset;
  sqlOptions.limit = limit;
  sqlOptions.order = [["createdAt", "DESC"]];

  // mengambil seluruh data user sesuai dengan sqlOptions
  const users = await Users.findAll(sqlOptions);

  return res.json({
    status: "success",
    data: users,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
