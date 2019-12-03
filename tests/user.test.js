const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Jessica Li",
    email: "mjd64929@gmail.com",
    password: "123456Mypass!",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
};

const userTwo = {
    name: "Qif Yang",
    email: "mjd64929@qq.com",
    password: "123456Mypass!"
}


beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save()
});

test("Should sign up a new user", async ()=> {
    const response = await request(app).post("/users").send({
        name: "John Mai",
        email: "mjd64929@icloud.com",
        password: "123456Mypass!"
    }).expect(201)

    //    Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull();

    //    Assertions about the response
    // expect(response.body.user.name).toBe("John Mai");
    expect(response.body).toMatchObject({
        user: {
            name: "John Mai",
            email: "mjd64929@icloud.com",
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("123456Mypass!")
});

test("Should login existing user", async ()=> {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

});

test("Should not login nonexistent user", async ()=> {
    await  request(app).post("/users/login").send({
        email: userTwo.email,
        password: userTwo.password
    }).expect(400)
});

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async ()=> {
    await  request(app)
        .get("/users/me")
        .send()
        .expect(401)
});



test("Should upload avatar image", async ()=> {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar","tests/fixtures/philly.jpg")
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

// test("Should update valid user fields", async ()=> {
//     await request(app)
//         .patch("./users/me")
//         .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             name: "Johnny"
//         })
//         .expect(200);
//
//     const user = await User.findById(userOneId);
//     expect(user.name).toEqual("Johnny");
//
// })
//
// test("Should not update invalid user fields", async ()=> {
//     await request(app)
//         .patch("./users/me")
//         .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             location: "Johnny"
//         })
//         .expect(400);
// })

test("Should delete account for user", async ()=> {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user).toBeNull()
});

test("Should not delete account for unauthenticated user", async ()=> {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
});




// afterEach(() => {
//     console.log("afterEach")
// });
