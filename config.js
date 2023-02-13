require("dotenv").config();
const { JWT_SECRET, URI_DB, PORT } = process.env;

module.exports = { JWT_SECRET, URI_DB, PORT };
