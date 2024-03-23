const { Sequelize } = require("sequelize");

const rogerSequelize = new Sequelize("ROGER_DB", "TEST_ROGER", "roger1234", {
  host: "148.66.136.10",
  dialect: "mysql",
});

const test = async () => {
  try {
    await rogerSequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
test();

// const syncDB = async () => {
//   let syncResponse = await rogerSequelize.sync({ force: true }); // Sync the model with the database
//   console.log("syncResponse", syncResponse);
// };

// syncDB();

module.exports = {
  rogerSequelize,
};
