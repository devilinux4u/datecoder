require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");
const models = require('./model'); 

const user = encodeURIComponent('sololinux');
const pass = encodeURIComponent(process.env.pass);
const cluster = 'sololinux.errs8e9.mongodb.net';

const uri = `mongodb+srv://${user}:${pass}@${cluster}/?appName=sololinux`;

try {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log(`MongoDB connected Successfully..!`));
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
