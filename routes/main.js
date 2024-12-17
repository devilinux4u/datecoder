const express = require('express');
const router = express.Router();
const { user } = require('../db/db');
const { isUser } = require('../middleware/session')


router.get('/main', isUser, async (req, res) => {
    try {
        const cId = req.session.isUser.id;
        const cGen = (await user.findOne({ log_id: cId }, 'gender').lean()).gender;
        const oGen = cGen === 'male' ? 'female' : 'male';

        const profiles = await user.find({
            gender: oGen
        }).lean();

        const suff = profiles.sort(() => Math.random() - 0.5);

        res.render('main', { profiles: suff });
    }
    catch (err) {
        console.error('Error fetching profiles:\n', err);
        res.status(500).send('An error occurred while fetching profiles.');
    }
})

router.get('/profile', isUser, async (req, res) => {
    res.render('profile', { profile: (await user.findOne({ log_id: req.session.isUser.id }).lean()) });
});


module.exports = router;