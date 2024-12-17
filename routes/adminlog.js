require('dotenv').config();
const express = require('express');
const router = express.Router();


router.get('/adminlogin', (req, res) => {
    (req.session.isAdmin)
        ? res.redirect('/admin')
        : res.render('adminlog')
})

router.post('/adminlogin', (req, res) => {
    if (req.body.email == process.env.user && req.body.pass == process.env.pass) {
        req.session.isAdmin = true;
        res.redirect('admin');
    }
    else { res.render('adminlog'); }
})

router.get('/adminlogout', (req, res) => {
    if (req.session.isAdmin) req.session.destroy() && res.clearCookie("connect.sid");
    res.render('adminlog')
})


module.exports = router;