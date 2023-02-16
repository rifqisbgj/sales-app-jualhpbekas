module.exports = (sequelize, DataTypes) => {
  const Produk = sequelize.define(
    "Produk",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      imei: { type: DataTypes.STRING(15), allowNull: false },
      namaproduk: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      harga: { type: DataTypes.INTEGER, allowNull: true },
      id_varian: { type: DataTypes.INTEGER, allowNull: false },
      statusproduk: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "BQC",
        values: ["BQC", "PQC", "SQC", "SJ"],
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "produks" }
  );

  Produk.associate = (models) => {
    Produk.belongsTo(models.Varian, {
      foreignKey: "id_varian",
      as: "varianProduk",
    });
    Produk.hasMany(models.GambarProduk, { as: "gambarProduk" });
  };

  return Produk;
};
