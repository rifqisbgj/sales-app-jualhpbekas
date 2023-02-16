"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("image_produk", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      image: { type: Sequelize.STRING, allowNull: false },
      id_produk: { type: Sequelize.UUID, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint("image_produk", {
      type: "foreign key",
      name: "gambar produk",
      fields: ["id_produk"],
      references: {
        table: "produks",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("image_produk");
  },
};
