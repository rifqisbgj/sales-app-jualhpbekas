module.exports = (sequelize, DataTypes) => {
  const Varian = sequelize.define(
    "Varian",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      namavarian: { type: DataTypes.STRING, allowNull: false },
      id_merk: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { tableName: "varians" }
  );

  Varian.associate = (models) => {
    Varian.belongsTo(models.Merek, { foreignKey: "id_merk", as: "merk" });
  };

  return Varian;
};
