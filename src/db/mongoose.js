const mongoose = require('mongoose');

// mongodb://127.0.0.1:27017/task-manage-api

mongoose.connect(process.env.MONGODB_URL,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});




// const me = new User({
//     name: "   John   ",
//     email: "fohn@bluroot.com   ",
//     password: "abfffdd"
// })
//
// me.save().then(() => {
//     console.log(me)
// }).catch((err) => {
//     console.log(err)
// })


// const task = new Task({
//     description: "Learn how to use the Mongoose Library",
//     completed: false
// });
//
// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })