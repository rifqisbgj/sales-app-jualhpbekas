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
      kodeproduk: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      harga: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      id_varian: { type: DataTypes.INTEGER, allowNull: false },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      statusproduk: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: "BQC",
        /* STATUS:
        Belum Quality Control (BQC)
        Proses Quality Control (PQC)
        Selesai Quality Control (SQC)
        Siap Jual (SJ)
        Denied (D)
        Terjual (T)
         */
        values: ["BQC", "PQC", "SQC", "SJ", "D", "T"],
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ram: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warna: {
        type: DataTypes.STRING,
        allowNull: false,
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
    Produk.hasOne(models.HasilQC, {
      foreignKey: "id_produk",
      as: "qcProduct",
    });
    Produk.belongsTo(models.Varian, {
      foreignKey: "id_varian",
      as: "varianProduk",
    });
    Produk.hasMany(models.GambarProduk, {
      foreignKey: "id_produk",
      as: "gambarProduk",
    });
  };

  return Produk;
};
