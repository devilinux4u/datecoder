const express = require('express');
const router = express.Router();
const { user, match } = require('../db/db');
const { isUser } = require('../middleware/session')


router.get('/main', isUser, async (req, res) => {
    try {
        const cId = req.session.isUser.id;
        const cUser = await user.findOne({ log_id: cId }).lean();
        const oGen = cUser.gender === 'male' ? 'female' : 'male';

        const userMatches = await match.findOne({ log_id: cId });

        let filterCondition = {};
        if (userMatches && userMatches.like.length > 0) {
            filterCondition = { log_id: { $nin: userMatches.like } };
        }

        const profiles = await user.find({
            gender: oGen,
            ...filterCondition
        }).lean();


        const suff = profiles.sort(() => Math.random() - 0.5);

        let lastMatchedUser = null;
        if (userMatches && userMatches.match.length > 0) {
            const lastMatchId = userMatches.match[Math.floor(Math.random() * userMatches.match.length)];
            lastMatchedUser = await user.findOne({ log_id: lastMatchId }).lean();
        }

        res.render('main', { profiles: suff, check: lastMatchedUser, uimg: cUser.photo, num: userMatches });
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