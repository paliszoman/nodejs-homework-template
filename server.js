const app = require("./app");
const mongoose = require("mongoose");

const env = require("./config");

const PORT = env.port;
const uriDB = env.uri;

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
