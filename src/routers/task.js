const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth')
const router = new express.Router();

// GET /task?completed=false
// GET /task?limit=10&skip=10
// GET /task?sortBy=createdAt_asc/createdAt_desc
router.get('/task', auth ,async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        // const parts = req.query.sortBy.split(":");
        // sort[parts[1]] = sort[parts[2]] === 'desc' ? -1 : 1;


        const groups = req.query.sortBy.split('|');
        groups.forEach((group) => {
            const parts = group.split(':');
            sort[parts[1]] = sort[parts[2]] === 'desc' ? -1 : 1;
        });
    }

    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)

    } catch (e) {
        res.status(500).send();

    }
});

// GET /task/id
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

// POST /task
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

// UPDATE /task/id
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