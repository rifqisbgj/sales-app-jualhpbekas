module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      nama: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM,
        defaultValue: "admin",
        values: ["super", "admin"],
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "user" }
  );

  Users.associate = (models) => {
    Users.hasMany(models.HasilQC, { as: "produkQCByAdmin" });
    Users.hasMany(models.Users, { as: "createAdmin" });
    Users.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "createByAdmin",
    });
  };
};
