const fs = require("fs");

module.exports = (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
  });
};
