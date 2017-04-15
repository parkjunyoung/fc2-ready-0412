var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CommentSchema = new Schema({
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    post_id : Number
});

CommentSchema.plugin( autoIncrement.plugin , 
    { model : 'comment', field: "id", startAt: 1 });
module.exports = mongoose.model('comment', CommentSchema); 














