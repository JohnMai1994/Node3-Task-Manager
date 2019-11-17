require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndRemove("5dc080d9627bbe408ac3a6f3").then((task)=> {
    console.log(task);
    return Task.countDocuments();
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
});