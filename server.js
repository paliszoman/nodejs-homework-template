const app = require("./app");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT;
const uriDB = process.env.uriDb;

mongoose.set("strictQuery", false);

const connection = mongoose.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.on("exit", () => mongoose.disconnect());

connection
  .then(() => {
    console.log("Database connection successfull!");
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("Server not running. Error: ", err);
    process.on(1, () => mongoose.disconnect());
  });
