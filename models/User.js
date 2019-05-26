var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: "Username is required!"
    },
    email: {
        type: String,
        trim: true,
        required: "Email is required!"
    },
    password: {
        type: String,
        trim: true,
        required: "Password is required!"
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    favs: {
        type: Array,
        unique: true,
    },
    isSuperUser: {
        type: Boolean,
        default: false
    },
});

UserSchema.methods.validatePassword = function(user, password) {
    if (user[0].password !== password){
        var isMatch = false;
        return Promise.resolve(isMatch);
    } else {
        var isMatch = true;
        return Promise.resolve(isMatch);
    }
}

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;