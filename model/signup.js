const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    txt: String,
    email: String,
    pswd: String,
})
const User = new mongoose.model("User", userSchema);
module.exports = User;