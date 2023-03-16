module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      nama: { type: DataTypes.STRING, allowNull: false },
      notelp: { type: DataTypes.STRING, allowNull: true },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: { field: "updated_at", type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "customer" }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Transaksi, {
      foreignKey: "id_customer",
      as: "transaksi",
    });
  };

  return Customer;
};
