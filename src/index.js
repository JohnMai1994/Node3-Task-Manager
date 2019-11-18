const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//--------------------- User --------------------------
app.use(userRouter);
// ------------------------- Task ---------------------------------
app.use(taskRouter)




app.listen(port, () => {
    console.log("Server is up on port "+ port);
});


// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const myFunction = async () => {
    //------------- Bcrypt ------------------
    // const password = 'Red12345!';
    // const hashedPassword = await bcrypt.hash(password, 8);
    // console.log(password);
    // console.log(hashedPassword);
    //
    // const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
    // console.log(isMatch);
    // ------------------------------
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {expiresIn: "1 day"});
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse');
    console.log(data);

}

myFunction();

// andrew -> lakjdsfowqiure -> andrew
// mypass -> lakdsjflasdfjal  which is one way