const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT ;


// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disable')
//     } else {
//         next()
//     }
// });

// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down, Check back soon")
// })

app.use(express.json());
//--------------------- User --------------------------
app.use(userRouter);
// ------------------------- Task ---------------------------------
app.use(taskRouter);

// Without middleware: new request -> run route handler

// With middleware:    new request -> do something -> run route handler




app.listen(port, () => {
    console.log("Server is up on port "+ port);
});

// const Task = require("./models/task");
// const User = require("./models/user")
//
// const main = async () =>{
//     // const task = await Task.findById("5dd5c2c06f8fd132b6aafae1");
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);
//
//     const user = await  User.findById("5dd5c2626f8fd132b6aafadf");
//     await user.populate("tasks").execPopulate();
//     console.log(user.tasks);
//
// }
//
// // main()




// // const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const myFunction = async () => {
//     //------------- Bcrypt ------------------
//     // const password = 'Red12345!';
//     // const hashedPassword = await bcrypt.hash(password, 8);
//     // console.log(password);
//     // console.log(hashedPassword);
//     //
//     // const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
//     // console.log(isMatch);
//     // ------------------------------
//     // const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {expiresIn: "1 day"});
//     // console.log(token)
//     //
//     // const data = jwt.verify(token, 'thisismynewcourse');
//     // console.log(data);
//
// }
//
// // myFunction();
//
// // andrew -> lakjdsfowqiure -> andrew
// // mypass -> lakdsjflasdfjal  which is one way

// const multer = require("multer");
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, callback){
//         // if(!file.originalname.endsWith(".pdf")) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return callback(new Error("Please Upload a Word document!"))
//         }
//
//         callback(undefined, true);
//
//         // callback(new Error('File must be a PDF'));
//         // callback(undefined, true);
//         // callback(undefined, false);
//     }
// })
// const errorMiddleware = (req, res, next) => {
//     throw new Error("From my errorMiddleware");
// }
// app.post("/upload", upload.single("upload") ,(req,res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// });