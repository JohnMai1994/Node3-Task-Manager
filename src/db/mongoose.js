const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manage-api',  {
    useNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});


const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const task = new Task({
    description: "Learn how to use the Mongoose Library",
    completed: false
});

task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
})