module.exports = (...roles) => {
  return (req, res, next) => {
    // mengambil data role yang berada pada req.user (yg sebelumnya dipassing oleh verifyUser)
    const roleUser = req.user.data.role;

    /* 
    jika data array roles yang diberikan pada route,
    berbeda dengan apa yg terdapat pada roleUser
    */
    if (!roles.includes(roleUser)) {
      return res
        .status(405)
        .json({ status: "error", message: "you dont have permission" });
    }
    return next();
  };
};
