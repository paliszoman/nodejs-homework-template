const app = require("./app");
const mongoose = require("mongoose");

const { URI_DB, PORT } = require("./config");
const { createFolderNotExisting } = require("./utils/mkdir.js");
const { tmpDir, avatarDir } = require("./middleware/files.js");

mongoose.set("strictQuery", false);

const connection = mongoose.connect(URI_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.on("exit", () => mongoose.disconnect());

connection
  .then(() => {
    console.log("Database connection successfull!");
    app.listen(PORT, async () => {
      await createFolderNotExisting(tmpDir);
      await createFolderNotExisting(avatarDir);
      console.log("Server running. Use our API on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("Server not running. Error: ", err);
    process.on(1, () => mongoose.disconnect());
  });
