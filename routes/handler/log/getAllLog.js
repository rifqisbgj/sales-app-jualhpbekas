const fs = require("fs");
const moment = require("moment");
require("twix");

function Paginator(items, page, per_page) {
  var page = page || 0,
    per_page = per_page || 10,
    offset = page * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems,
  };
}

module.exports = async (req, res) => {
  // defaul akan berisi tanggal sekarang
  const dateTwo = req.query.dateTwo || moment().format("YYYY-MM-DD");
  // default akan berisi 7 hari sebelum tanggal sekarang
  const dateOne =
    req.query.dateOne || moment().subtract(7, "d").format("YYYY-MM-DD");
  const method = req.query.method || "";
  const level = req.query.level || "";
  const page = parseInt(req.query.page) || 0;

  //   cek filter tanggal
  if (dateOne > dateTwo) {
    return res.status(400).json([
      {
        status: "error",
        message: "Tanggal pertama tidak boleh lebih besar dari tanggal kedua",
      },
    ]);
  }

  // mengambil range dari 1 tanggal ke tanggal lain
  const itr = moment.twix(new Date(dateOne), new Date(dateTwo)).iterate("days");
  // penyimpanan list range tanggal
  let listDate = [];
  // menyimpan list tanggal
  while (itr.hasNext()) {
    // jika terdapat jarak, maka masukan ke penyimpanan list tanggal
    listDate.push(itr.next().format("YYYY-MM-DD"));
  }

  //   menyimpan data log
  let logData = [];
  //   diulang berdasarkan tanggal yang diterima dari list tanggal dan diurutkan berdasarkan terbaru (reverse)
  listDate.reverse().forEach((dateFile) => {
    // pengecekan file log dengan tanggal yang ada di listDate
    if (fs.existsSync(`./logs/backup/app-${dateFile}.log`)) {
      // jika file tersedia, maka baca file tersebut dan split data berdasarkan baris baru
      let data = fs
        .readFileSync(`./logs/backup/app-${dateFile}.log`, {
          encoding: "utf8",
          flag: "r",
        })
        .split("\n");
      // mengurutkan dari data terbaru
      data.reverse();
      for (let i = 0; i < data.length; i++) {
        // jika data kosong, maka lanjutkan ke berikutnya
        if (data[i] === "") {
          continue;
        }
        // jika user melakukan filter by method only
        if (method !== "" && level === "") {
          if (JSON.parse(data[i]).method === method) {
            logData.push(JSON.parse(data[i]));
          }
          continue;
        }
        // jika user melakukan filter by level only
        if (method === "" && level !== "") {
          if (JSON.parse(data[i]).level === level) {
            logData.push(JSON.parse(data[i]));
          }
          continue;
        }
        // jika user melakukan filter by method & level
        if (method !== "" && level !== "") {
          if (
            JSON.parse(data[i]).level === level &&
            JSON.parse(data[i]).method === method
          ) {
            logData.push(JSON.parse(data[i]));
          }
          continue;
        }
        // jika tidak ada filter
        logData.push(JSON.parse(data[i]));
      }
    }
  });

  return res.json(Paginator(logData, page));
};
