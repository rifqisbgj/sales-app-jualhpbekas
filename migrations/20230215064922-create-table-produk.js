"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("produks", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      imei: { type: Sequelize.STRING(15), allowNull: false },
      namaproduk: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false },
      harga: { type: Sequelize.INTEGER, allowNull: true },
      id_varian: { type: Sequelize.INTEGER, allowNull: false },
      statusproduk: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "BQC",
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint("produks", {
      type: "foreign key",
      name: "varian produk",
      fields: ["id_varian"],
      references: {
        table: "varians",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("produks");
  },
};
