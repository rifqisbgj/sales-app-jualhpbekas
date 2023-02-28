const { Users } = require("../../../models");

module.exports = async (req, res) => {
  const email = req.body.email;
  const user = await Users.findOne({ where: { email: email } });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  await Users.update({ refresh_token: null }, { where: { email: email } });

  return res.json({
    status: "success",
    message: "user token deleted",
  });
};
