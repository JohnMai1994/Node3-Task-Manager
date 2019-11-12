const express = require('express');
require('./db/mongoose');
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user)
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get("/users", (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send()
    })
});

app.get("/users/:id", (req, res)=> {
    const _id = req.params.id;
    User.findById({_id}).then((user) => {
        if (!user) {
            return res.status(404).send("This Id Not Exist ");
        }
        res.status(200).send(user)
    }).catch((err) => {
        res.status(500).send(err);
    })
});


app.post('/task', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task)
    }).catch( (err) => {
        res.status(400).send(err);
    })
});

app.get('/task', (req, res) => {
    Task.find({}).then((task) => {
        res.status(200).send(task);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

app.get('/task/:id', (req, res) => {
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



app.listen(port, () => {
    console.log("Server is up on port "+ port);
});