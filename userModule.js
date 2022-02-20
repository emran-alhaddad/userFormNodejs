var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/users');

const userSchema = mongoose.Schema({
    FullName: {
        type: String,
        required: [true, 'User Must Have Full Name'],
    },
    userName: {
        type: String,
        required: [true, 'User Must Have User Name'],
    },

    email: String,
    image: String,
    cv: String,


});


var User = db.model('User', userSchema);

module.exports = User;