require('dotenv').config();
const express = require('express');
const router = express.Router();
const { user, match } = require('../db/db');
const { isUser } = require('../middleware/session');
const { mail } = require('../helpers/mailer');


router.post('/api/like', isUser, async (req, res) => {
    const cId = req.session.isUser.id;
    const { lid } = req.body;

    try {
        let userMatchDoc = await match.findOne({ log_id: cId });

        if (!userMatchDoc) {
            userMatchDoc = await match.create({
                log_id: cId,
                like: [],
                match: [],
                count: "0"
            });
        }

        if (!userMatchDoc.like.includes(lid)) {
            userMatchDoc.like.push(lid);
            await userMatchDoc.save();
        }


        let likedUserMatchDoc = await match.findOne({ log_id: lid });

        if (!likedUserMatchDoc) {
            likedUserMatchDoc = await match.create({
                log_id: lid,
                like: [],
                match: [],
                count: "0"
            });
        }

        likedUserMatchDoc.count = (parseInt(likedUserMatchDoc.count) + 1).toString();
        await likedUserMatchDoc.save();



        if (likedUserMatchDoc && likedUserMatchDoc.like.includes(cId)) {
            if (!userMatchDoc.match.includes(lid)) {
                userMatchDoc.match.push(lid);
            }

            if (!likedUserMatchDoc.match.includes(cId)) {
                likedUserMatchDoc.match.push(cId);
            }

            await userMatchDoc.save();
            await likedUserMatchDoc.save();

            let u = await user.findOne({ log_id: cId }).lean();
            let nu = await user.findOne({ log_id: lid }).lean();

            res.status(200).json({ match: true, uimg: u.photo }); 

            mail(u.email, nu);
            mail(nu.email, u);

        }
        else{
            res.status(200).json({ match: false }); 
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the like.' });
    }
})

router.get('/viewmatch', isUser, async (req, res) => {
    try {
        const logId = req.session.isUser.id; 

        const userMatches = await match.findOne({ log_id: logId }).lean();

        if (!userMatches) {
            res.render('viewmatch', {data: false, stat: {like: [], match: [], count: '0'}});
        }
        else{
            const matchedUsers = await user.find({ log_id: { $in: userMatches.match } }).lean();
            res.render('viewmatch', {data: true, stat: userMatches, match: matchedUsers});
        }
    } 
    catch (error) {
        console.error('Error fetching matches:\n', error);
        res.status(500).send('Server Error while fetching matched profile');
    }
});


module.exports = router;