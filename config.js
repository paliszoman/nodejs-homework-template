require("dotenv").config();
const { JWT_SECRET, URI_DB, PORT, SENDGRID_API_KEY } = process.env;

module.exports = { JWT_SECRET, URI_DB, PORT, SENDGRID_API_KEY };
