const mongoose = require('mongoose');

const Todos = mongoose.model('Todos', new mongoose.Schema({
    text: {type:String,reqired:true},
    done: {type:mongoose.SchemaTypes.Boolean,reqired:true},
    user: {type:mongoose.SchemaTypes.ObjectId},
}));

module.exports = Todos;