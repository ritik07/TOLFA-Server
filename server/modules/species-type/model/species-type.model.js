// Define the Sequelize model
const { DataTypes } = require("sequelize");
const { rogerSequelize } = require("../../../../database/sequelize");

const TolfaSpecies = rogerSequelize.define(
  "tolfa_species",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rescue_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current date and time
      field: 'created_at' // Map Sequelize's createdAt to your table's created_at column
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set default value to current date and time
      field: 'updated_at' // Map Sequelize's updatedAt to your table's updated_at column
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "tolfa_species",
    timestamps: true, // If you want Sequelize to manage timestamps automatically, set this to true
    createdAt: 'created_at', // Map Sequelize's createdAt to your table's created_at column
    updatedAt: 'updated_at'  // Map Sequelize's updatedAt to your table's updated_at column
  }
);

// Method to update
TolfaSpecies.prototype.updateTolfaSpecies = async function (id, newData) {
  try {
    const tolfaSpecies = await TolfaSpecies.findByPk(id);
    if (!tolfaSpecies) {
      throw new Error("Tolfa species not found");
    }

  // Update fields
  tolfaSpecies.rescue_type_id = newData.rescue_type_id !== undefined ? newData.rescue_type_id : tolfaSpecies.rescue_type_id;
  tolfaSpecies.name = newData.name !== undefined ? newData.name : tolfaSpecies.name;
  tolfaSpecies.created_by = tolfaSpecies.created_by;
  tolfaSpecies.updated_by = newData.updated_by !== undefined ? newData.updated_by : tolfaSpecies.updated_by;
  tolfaSpecies.created_at = tolfaSpecies.created_at;
  tolfaSpecies.updated_at = newData.updated_at !== undefined ? newData.updated_at : tolfaSpecies.updated_at;
  tolfaSpecies.active = newData.active !== undefined ? newData.active : tolfaSpecies.active;

    await tolfaSpecies.save();

    return tolfaSpecies;
  } catch (error) {
    throw error;
  }
};

module.exports = { TolfaSpecies };
