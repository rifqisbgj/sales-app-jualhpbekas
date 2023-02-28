const { Users } = require("../../../models");
const uuid = require("uuid");

module.exports = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user identity" });
  }

  const user = await Users.findByPk(req.params.id, {
    attributes: ["id", "nama", "email", "role", "avatar"],
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  return res.json({
    status: "success",
    data: user,
  });
};
