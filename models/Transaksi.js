module.exports = (sequelize, DataTypes) => {
  const Transaksi = sequelize.define(
    "Transaksi",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      id_customer: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_admin: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      detail: { type: DataTypes.ARRAY(DataTypes.JSONB), allowNull: false },
      kode_invoice: { type: DataTypes.STRING, allowNull: false },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "transaksi" }
  );

  Transaksi.associate = (models) => {
    Transaksi.belongsTo(models.Customer, {
      foreignKey: "id_customer",
      as: "transaksiCustomer",
    });
    Transaksi.belongsTo(models.Users, {
      foreignKey: "id_admin",
      as: "adminTransaksi",
    });
  };

  return Transaksi;
};
