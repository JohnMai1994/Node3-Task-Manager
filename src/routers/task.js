const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

// GET /task?completed=false
router.get('/task', auth ,async (req, res) => {
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }


    const _id = req.params.id;
    try {
        await req.user.populate({
            path: "tasks",
            match
        }).execPopulate();
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send();

    }
});

router.get('/task/:id', auth , async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if (!task) {
            return res.status(400).send()
        }
    }catch (e) {
        res.status(500).send()
    }
});

router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

router.patch('/task/:id', auth ,async (req, res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "invalid updates!"})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send("404 Man!");
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save()
        res.send(task);

    }catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/task/:id', auth ,async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send("Id is not exist")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;