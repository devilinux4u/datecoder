const express = require('express');
const router = express.Router();
const { login } = require('../db/db');
const { dec } = require('../helpers/hash');

router.get('/', (req, res) => {
    (req.session.isUser)
        ? res.redirect('/main')
        : res.render('userlog', { errmsg: false })
})

router.post('/userlogin', async (req, res) => {
    const { useru, passu } = req.body;
    
    try {
        let user = await login.findOne({ user: useru });

        if (!user) {
            res.render('userlog', { errmsg: "User doesn't exist" });
        }
        else if (user && dec(passu, user.pass)) {
            req.session.isUser = { id: user._id};
            res.redirect('/main');
        }
        else {
            res.render('userlog', { errmsg: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err.message)
        res.render('userlog', { errmsg: 'Unexpected Error! Contact registration desk' });
    }
})

router.post('/userlogout', (req, res) => {
    if (req.session.isUser) req.session.destroy() && res.clearCookie("connect.sid");
    res.redirect('/')
})


module.exports = router;