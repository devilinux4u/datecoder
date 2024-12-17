require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require('express-session');

const adminlog = require('./routes/adminlog');
const admin = require('./routes/admin');
const userlog = require('./routes/userlog');
const main = require('./routes/main');
const match = require('./routes/match');


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.secret_key,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

app.use('/', adminlog, admin, userlog, main, match);

app.get('*', (req, res) => {
    res.send('404 error page');
})


app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});