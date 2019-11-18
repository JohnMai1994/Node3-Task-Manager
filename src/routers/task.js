const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/task', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task)
    }).catch( (err) => {
        res.status(400).send(err);
    })
});

router.get('/task', (req, res) => {
    Task.find({}).then((task) => {
        res.status(200).send(task);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

router.get('/task/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById({_id}).then((task)=> {
        if (!task) {
            return res.status(400).send("The id not exist");
        }

        res.status(200).send(task);
    }).catch((err)=> {
        res.status(500).send(err);
    })
})

router.patch('/task/:id', async (req, res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: "invalid updates!"})
    }

    try {
        const task = await User.findById(req.params.id);

        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save()
        // const task = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if (!task) {
            return res.status(404).send("404 Man!");
        }

        res.send(task);

    }catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/task/:id', async (req,res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send("Id is not exist")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;