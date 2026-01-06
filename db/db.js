require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");
const models = require('./model'); 

try {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log(`MongoDB connected Successfully..!`))
}
catch (error) {
    console.log(`MongoDB Error: `, error.message);
    process.exit(1);
}


module.exports = {
  user: models.users,
  login: models.logins,
  match: models.matches
};
