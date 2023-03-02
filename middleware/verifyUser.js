const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  //   mengecek apakah token valid atau tidak
  jwt.verify(token, JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(403).json({ message: err.message });
    }
    // mengembalikan dengan req.user yang berisi hasil decode token
    req.user = decode;
    return next();
  });
};
