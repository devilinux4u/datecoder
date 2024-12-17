const mongoose = require('mongoose');
const schema = mongoose.Schema;

const users = new schema(
    {
        photo: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: String, required: true },
        gender: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        insta: { type: String, unique: true, required: true },
        des: { type: String},
        log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'login', required: true },
    }
);

const logins = new schema(
    {
        user: { type: String, unique: true, required: true },
        pass: { type: String, required: true },
    }
);

const matches = new schema(
    {
        log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'login', required: true },
        like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        match: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        count: { type: String}
    }
);


module.exports = {
    users: mongoose.model("user", users),
    logins: mongoose.model("login", logins),
    matches: mongoose.model("match", matches)
}