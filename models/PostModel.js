var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var PostSchema = new Schema({
    title : {
        type : String,
        required: [true, '제목은 입력해주세요']
    },
    content : String,
    thumbnail : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    username : String  //작성자추가
});

PostSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

PostSchema.plugin( autoIncrement.plugin,
{ model : "post", field : "id", startAt: 1 });
module.exports = mongoose.model("post", PostSchema);



























