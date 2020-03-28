const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    //console.log(req.body);

    try{
        const user = new User({username, password});
        //console.log(user);
        await user.save();

        //const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
        //res.send({token});
        //console.log(req.body);
    }catch(err){
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(422).send({error: 'Must provide an email and password'})
    }

    const user = await User.findOne({username});

    if(!user){
        return res.status(404).send({error: 'A user by that name is not found'});
    }

    try{
        await user.comparePassword(password);
        //const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
        //res.send({token});
        res.send("Found it!")
    }catch(err){
        return res.status(422).send({error: 'Invalid password or email'})
    }
})

router.post('/savescore', async (req, res) => {
    //const { username, password } = req.body
    //console.log(req.body);
    const username = req.body

    try{
        const user = await User.findOne({username});
        res.send("Score Saved")
    }catch(err){
        return res.status(422).send(err.message);
    }
});


module.exports = router;