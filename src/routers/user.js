const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const {sendWelcomeEmail, sendGoodByeEmail} = require("../email/account");


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    // Async & Await Style
    try {
        await user.save();
        sendWelcomeEmail(req.user.email, req.user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(err) {
        res.status(400).send(err);
    }
});




router.post('/users/login',async (req,res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        // First Method to hide user.password and user.tokens
        // res.send({ user: user.getPublicProfile(), token});
        // Second Method
        res.send({user, token})
    } catch (e) {
        console.log(e)
        res.status(400).send(e.Error);
    }
});

router.post('/users/logout', auth, async (req, res)=> {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send()

    }catch (e) {
        res.status(500).send()
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();

        res.send()

    }catch (e) {
        res.status(500).send()
    }
})



router.get("/users/me", auth ,async (req, res) => {
    res.send(req.user);

});

router.get("/users/:id", async (req, res)=> {
    const _id = req.params.id;

    try {
        const user = await User.findById({_id});
        if (!user) {
            return res.status(404).send("This Id Not Exist ");
        }
        res.status(200).send(user)
    }catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/users/me',auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "invalid updates!"})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save()
        res.send(req.user);

    }catch (e) {
        res.status(400).send(e);
    }
})


router.delete('/users/me', auth , async (req,res) => {
    try {
        await req.user.remove();
        sendGoodByeEmail(req.email, req.name);
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e);
    }
});


// Upload avatars
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return  callback(new Error("Please Upload Image"))
        }
        callback(undefined, true);
    }
});
router.post("/users/me/avatar", auth , upload.single("avatar"), async (req, res)=> {
    const buffer = await sharp( req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Image Upload Successfully!")
}, (error, req, res, next ) => {
    res.status(400).send({error: error.message});
});

router.delete("/users/me/avatar", auth, async (req, res) => {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send("Image Delete Successfully")
    }catch (e) {
        res.status(500).send("Delete Fail")
    }
});

router.get('/users/:id/avatar', async (req, res)=> {
    try {
        const user = await User.findById(req.params.id);
        if (!user  || !user.avatar)   {
            throw new Error("No User or No avatar")
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    }catch (e) {
        res.status(404).send("Can't not find this img")
    }
})

module.exports = router;