"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hasilqc", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      layar: { type: Sequelize.BOOLEAN, allowNull: false },
      batre: { type: Sequelize.BOOLEAN, allowNull: false },
      sinyal: { type: Sequelize.BOOLEAN, allowNull: false },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "Selesai QC",
      },
      id_produk: { type: Sequelize.UUID, allowNull: false },
      id_adminqc: { type: Sequelize.UUID, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint("hasilqc", {
      type: "foreign key",
      name: "produk qc",
      fields: ["id_produk"],
      references: {
        table: "produks",
        field: "id",
      },
    });
    await queryInterface.addConstraint("hasilqc", {
      type: "foreign key",
      name: "admin qc produk",
      fields: ["id_adminqc"],
      references: {
        table: "user",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("hasilqc");
  },
};
