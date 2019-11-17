require('../src/db/mongoose');
const User = require('../src/models/user');

//5dc080d9627bbe408ac3a6f3

User.findByIdAndUpdate('5dc054d30ad41d1b1440ab35', {age: 100}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 100})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e);
});

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count
}


// updateAgeAndCount('5dc073831dab1036dd31e1c0', 2).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async () => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false});
    return count;
};

deleteTaskAndCount('5dc073831dab1036dd31e1c0').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})