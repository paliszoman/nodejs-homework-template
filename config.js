require("dotenv").config();
const config = {
  jwtSecret: process.env.JWT_SECRET,
  uri: process.env.URI_DB,
  port: process.env.PORT,
};

module.exports = config;
