const { Users } = require("../../../models");
const uuid = require("uuid");
const Validator = require("fastest-validator");
const valid = new Validator();

module.exports = async (req, res) => {
  if (!uuid.validate(req.params.id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid user identity" });
  }
  const schema = {
    name: "string|empty:false",
    email: "email|empty:false",
    avatar: "string|optional",
  };

  const validate = valid.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  const id = req.params.id;
  const user = await Users.findByPk(id);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  const email = req.body.email;
  if (email) {
    const checkEmail = await Users.findOne({
      where: { email },
    });

    if (checkEmail && email != user.email) {
      return res.status(409).json({
        status: "error",
        message: "email already exist",
      });
    }
  }

  await user.update({
    nama: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
    role: req.body.role,
  });

  return res.json({
    status: "success",
    data: { user },
  });
};
