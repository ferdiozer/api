
const dotenv = require("dotenv");

dotenv.config();


const dbTables = {
  users: "users",
  tokens: "tokens",
  address: "address",
  fList: "flist",
}


const config = {
  APP_PORT: process.env.APP_PORT,
  MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
  LOGGER:process.env.LOGGER,
  MASTER_TOKEN:process.env.MASTER_TOKEN,
  dbTables
}

module.exports = config