require('dotenv').config();
const express = require('express');
const router = express.Router();
const { user, match } = require('../db/db');
const { isUser } = require('../middleware/session');



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

            res.status(200).json({ match: true, uimg: (await user.findOne({ log_id: cId }, 'photo').lean()).photo }); 

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


module.exports = router;