var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "148.66.136.10",
  user: "TEST_ROGER",
  password: "roger1234",
  database: "ROGER_DB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
