require('dotenv').config();
const express = require('express');
const router = express.Router();
const { user, match } = require('../db/db');
const { isUser } = require('../middleware/session');



router.get('/api/like', isUser, async (req, res) => {
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
            userMatchDoc.count = (parseInt(userMatchDoc.count) + 1).toString();
            await userMatchDoc.save();
        }


        const likedUserMatchDoc = await match.findOne({ log_id: lid });

        if (likedUserMatchDoc && likedUserMatchDoc.like.includes(cId)) {
            if (!userMatchDoc.match.includes(likedProfileId)) {
                userMatchDoc.match.push(likedProfileId);
            }

            if (!likedUserMatchDoc.match.includes(log_id)) {
                likedUserMatchDoc.match.push(log_id);
            }

            await userMatchDoc.save();
            await likedUserMatchDoc.save();

        }

        res.status(200).json({ match: false }); 
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the like.' });
    }
})


module.exports = router;