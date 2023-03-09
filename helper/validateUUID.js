const uuid = require("uuid");

const validateUUID = (data) => {
  // return hasil validasi berdasarkan validasi UUID dan versi UUID
  return uuid.validate(data) && uuid.version(data) === 1;
};

module.exports = validateUUID;
