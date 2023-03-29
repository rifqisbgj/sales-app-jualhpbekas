const { QueryTypes, Op } = require("sequelize");
const {
  Produk,
  HasilQC,
  Users,
  Customer,
  sequelize,
} = require("../../../models");
const moment = require("moment");

// mengambil rekap pendapatan transaksi mingguan
const getTransaction = async (req, res) => {
  const data = await sequelize.query(
    `SELECT SUM(transaksi.total) AS pendapatan, count(*) AS totalTransaksi, to_char(transaksi."created_at", 'YYYY-MM-DD') as "tanggal" FROM transaksi WHERE transaksi.created_at BETWEEN '${moment()
      .subtract(7, "d")
      .format("YYYY-MM-DD")}' AND '${moment()
      .add(1, "days")
      .format("YYYY-MM-DD")}' GROUP BY 3 ORDER BY 3`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// total pendapatan
const totalPendapatan = async (req, res) => {
  const data = await sequelize.query(
    `SELECT SUM(transaksi.total) FROM transaksi`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// rekap transaksi yang dilakukan admin
const transactionByAllAdmin = async (req, res) => {
  const data = await sequelize.query(
    `SELECT count(*) AS totaltransaksi, "user".nama, "user"."id" AS idAdmin, sum(jsonb_array_length(to_jsonb(transaksi.detail))) AS jmlProduk FROM transaksi INNER JOIN "user" ON transaksi.id_admin = "user"."id" GROUP BY 3 ORDER BY 1 DESC LIMIT 10;`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// total transaksi by admin
const getTransactionByAdmin = async (req, res) => {
  const data = await sequelize.query(
    `SELECT count(*) AS totaltransaksi, "user".nama, "user"."id" AS idAdmin, sum(jsonb_array_length(to_jsonb(transaksi.detail))) AS jmlProduk FROM transaksi INNER JOIN "user" ON transaksi.id_admin = "user"."id" WHERE transaksi.id_admin = '${req.user.data.id}' GROUP BY 3;`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// total produk siap jual
const getProductReady = async (req, res) => {
  const data = await Produk.count({ where: { statusproduk: "SJ" } });
  return res.json({ data });
};

// total produk belum siap jual
const getProductNotReady = async (req, res) => {
  const data = await Produk.count({
    where: { statusproduk: "SQC" },
  });
  return res.json({ data });
};

// total produk terjual
const getProductSold = async (req, res) => {
  const data = await sequelize.query(
    `SELECT sum(jsonb_array_length(to_jsonb(transaksi.detail))) AS jmlProduk FROM transaksi`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// total produk sudah QC
const getProductQC = async (req, res) => {
  const data = await Produk.count({ where: { statusproduk: "SQC" } });
  return res.json({ data });
};

// total produk belum QC
const getProductNotQC = async (req, res) => {
  const data = await Produk.count({
    where: { statusproduk: { [Op.or]: ["BQC", "PQC"] } },
  });
  return res.json({ data });
};

// total qc by admin
const getQCByAdmin = async (req, res) => {
  const sqlOpt = {};
  if (req.user.data.role === "adminQC") {
    sqlOpt.id_adminqc = req.user.data.id;
  }

  const data = await HasilQC.count({ where: sqlOpt });
  return res.json({ data });
};

// jumlah varian yang terjual
const getVarianSold = async (req, res) => {
  const data = await sequelize.query(
    `SELECT COUNT(varians.id) AS total_varian, varians.namavarian FROM transaksi JOIN varians ON varians."id" = ANY(SELECT (jsonb_array_elements(to_jsonb(transaksi.detail))->>'id_varian'::TEXT)::INTEGER) GROUP BY varians.namavarian ORDER BY 1 DESC LIMIT 10;`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// jumlah varian yang terjual
const getBrandSold = async (req, res) => {
  const data = await sequelize.query(
    `SELECT COUNT(merek.id) AS total_merek, merek.namamerek
    FROM transaksi
    JOIN merek ON merek."id" = ANY(SELECT (jsonb_array_elements(to_jsonb(transaksi.detail))->'varianProduk'->'merk'->'id'::TEXT)::INTEGER)
    GROUP BY merek.namamerek
    ORDER BY 1 DESC LIMIT 10;`,
    { type: QueryTypes.SELECT }
  );
  return res.json({ data });
};

// total admin
const getTotalAdmin = async (req, res) => {
  const data = await Users.count({
    where: { role: { [Op.not]: ["super"] } },
  });
  return res.json({ data });
};
// total customer
const getTotalCustomer = async (req, res) => {
  const data = await Customer.count();
  return res.json({ data });
};

module.exports = {
  getTransaction,
  transactionByAllAdmin,
  getProductReady,
  getProductNotReady,
  getProductSold,
  getProductQC,
  getQCByAdmin,
  getProductNotQC,
  getVarianSold,
  getBrandSold,
  totalPendapatan,
  getTotalAdmin,
  getTotalCustomer,
  getTransactionByAdmin,
};
