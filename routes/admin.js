const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/session');
const { user, login } = require('../db/db');
const { enc } = require('../helpers/hash');
const upload = require('../middleware/multer');
const { streamUpload } = require('../helpers/cloud');

router.get('/admin', isAdmin, (req, res) => {
    res.render('admin')
})

router.post('/admin/register', upload.single('pic'), async (req, res) => {
    try {
        const { name, age, gender, email, insta, des, usern, pass } = req.body;
        let pic = await streamUpload(req.file.buffer);

        const logger = new login({
            user: usern,
            pass: enc(pass)
        });
        const savedLogin = await logger.save();

        const users = new user({
            photo: pic.url,
            name,
            age,
            gender,
            email,
            insta,
            des,
            log_id: savedLogin._id, 
        });
        const savedUser = await users.save();

        res.status(201).json({
            message: 'Registration successful!',
            user: savedUser,
            login: savedLogin,
        });


    } catch (err) {
        console.error('Error during registration:\n', err);
        res.status(500).send(`${err.message} <br><b> Registration failed. Please try again. Call solo </b>` );
    }

})


module.exports = router;