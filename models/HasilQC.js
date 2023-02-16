module.exports = (sequelize, DataTypes) => {
  const HasilQC = sequelize.define(
    "HasilQC",
    {
      id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
      layar: { type: DataTypes.BOOLEAN, allowNull: false },
      batre: { type: DataTypes.BOOLEAN, allowNull: false },
      sinyal: { type: DataTypes.BOOLEAN, allowNull: false },
      catatan: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Selesai QC",
      },
      id_produk: { type: DataTypes.UUID, allowNull: false },
      id_adminqc: { type: DataTypes.UUID, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "hasilqc" }
  );

  HasilQC.associate = (models) => {
    HasilQC.belongsTo(models.Produk, {
      foreignKey: "id_produk",
      as: "produkQC",
    });
    HasilQC.belongsTo(models.Users, { foreignKey: "id_adminqc", as: "qcBy" });
  };
};
