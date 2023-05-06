const express = require("express");
const app = express();
const cors = require("cors");
const v1Routes = require("./server/v1");

app.use(express.static("file"));

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/v1", v1Routes);
app.use("/", (req, res) => {
  res.send("OK");
});

app.listen(process.env.PORT || 47381, () => {
  console.log(`Now listening on port ` + 47381);
});
