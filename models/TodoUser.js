const mongoose = require('mongoose');

const TodoUser = mongoose.model('TodoUser', new mongoose.Schema(
    {
        email: {type:String, unique:true},
        password: {type:String},
    }
));

module.exports = TodoUser;