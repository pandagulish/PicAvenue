const express = require('express')
const app = express();
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("./db/conn")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'))

// var finalValue = "";

// function handleChange(value) {
//     finalValue = value;
//     console.log(finalValue);
// }

// async function handleClick(finalValue) {
//     await fetch(`https://serpapi.com/search.json?q=${finalValue}&tbm=isch&ijn=1`)
//         .then((data) => { return (data.json()); })
//         .then((res) => {
//             console.log(res);
//         })
//         // console.log(finalValue);
//         // console.log("Clicked");
// }

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get('/', function(req, res) {
    res.render('index')
})

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("a1bd72acebad117c645597dad26e4d49aea74fd20d5e62e7d5a375f2493ad6cd");
const User = require("./model/signup")
app.post("/signup", async(req, res) => {
    try {
        const user = new User({
            txt: req.body.txt,
            email: req.body.email,
            pswd: req.body.pswd,
        })
        const registered = await user.save();
        res.redirect("/login")
    } catch (error) {
        res.status(400).send("error");
    }
})
app.post("/login", async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    try {
        if (!user) {
            res.send("invalid Username")
            return
        }
        if (user.pswd !== req.body.pswd) {
            res.send("invalid password");
            return
        }
        res.redirect("/")
    } catch (error) {
        res.status(400).send("error");
    }
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/signup", (req, res) => {
        res.render("signup")
    })
    // const params = {
    //     engine: "google",
    //     q: "Coffee"
    // };

// const callback = function(data) {
//     console.log(data["organic_results"]);
// };
// var params = {}
// Show result as JSON
// search.json(params, callback);

app.post('/search', function(req, res) {
    console.log(req.body.searchValue);
    // fetch(`https://serpapi.com/search.json?q=${req.body.searchValue}&tbm=isch&ijn=1`)
    //     .then((data) => { return (data.json()) })
    //     .then((response) => {
    //         // console.log(response);
    //         // res.render("base", { images: response.images_results })
    const params = {
        engine: "google",
        q: req.body.searchValue
    };

    function callback(data) {
        console.log(data["organic_results"]);
        res.render("base", { images: data["organic_results"] })
    };
    search.json(params, callback)
});

// })
// })

app.listen(3000, function() {
    console.log('Server started');
})