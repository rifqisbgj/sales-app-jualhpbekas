module.exports = (sequelize, DataTypes) => {
  const Merek = sequelize.define(
    "Merek",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      namamerek: { type: DataTypes.STRING, allowNull: false },
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
    { tableName: "merek" }
  );

  Merek.associate = (models) => {
    Merek.hasMany(models.Varian, { as: "varian" });
  };

  return Merek;
};
