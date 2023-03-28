module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      nama: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING },
      role: {
        type: DataTypes.ENUM,
        defaultValue: "admin",
        values: ["super", "admin"],
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
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
    Users.hasMany(models.HasilQC, {
      foreignKey: "id_adminqc",
      as: "produkQCByAdmin",
    });
    Users.hasMany(models.Transaksi, {
      foreignKey: "id_admin",
      as: "transaksiByAdmin",
    });
    Users.hasMany(models.Users, {
      foreignKey: "created_by",
      as: "createAdmin",
    });
    Users.belongsTo(models.Users, {
      foreignKey: "created_by",
      as: "createByAdmin",
    });
  };

  return Users;
};
