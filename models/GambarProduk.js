module.exports = (sequelize, DataTypes) => {
  const GambarProduk = sequelize.define(
    "GambarProduk",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      image: { type: DataTypes.STRING, allowNull: false },
      id_produk: { type: DataTypes.UUID, allowNull: false },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "image_produk" }
  );
  GambarProduk.associate = (models) => {
    GambarProduk.belongsTo(models.Produk, {
      foreignKey: "id_produk",
      as: "listGambarProduk",
    });
  };
  return GambarProduk;
};
