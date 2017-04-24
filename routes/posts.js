var express = require('express');
var router = express.Router();
var PostModel = require('../models/PostModel');
var CommentModel = require('../models/CommentModel');

var loginRequired = require('../libs/loginRequired');

// csrf 셋팅
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' );
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) {
        callback(null, 'posts-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });


router.get('/' , function(req, res){
    PostModel.find().sort({ created_at : -1 }).exec(function(err, posts){
        res.render('posts/list', { posts : posts });
    });
});

router.get('/write', loginRequired, csrfProtection, function(req, res){
    res.render('posts/form', { post : "", csrfToken : req.csrfToken() });
});

router.post('/write', loginRequired, upload.single('thumbnail'), csrfProtection, function(req, res){
    
    /*
    if(req.file.mimetype.split('/')[0]!=='image'){
        res.send('erro');
    }
    */

    var post = new PostModel({
        title : req.body.title,
        content : req.body.content,
        thumbnail : (req.file) ? req.file.filename : "",
        username : req.user.displayname
    });

    var validationError = post.validateSync();
    if(validationError){
        res.send(validationError);
    }else{
        post.save(function(err){
            res.redirect('/posts');
        });
    }
});

router.get('/detail/:id' , csrfProtection, function(req, res){
    PostModel.findOne( { 'id' :  req.params.id } , function(err ,post){
        CommentModel.find({ post_id : req.params.id } , 
            function(err, comments){
                res.render('posts/detail', 
                { post: post , comments : comments , csrfToken : req.csrfToken() });
            }
        );        
    });
});

router.post( '/ajax_comment/insert', csrfProtection, function(req,res){
    var comment = new CommentModel({
        content : req.body.content,
        post_id : parseInt(req.body.post_id)
    });
    comment.save(function(err, comment){
        res.json({
            id : comment.id,
            content : comment.content,
            message : "success"
        });
    });
});

router.post('/ajax_comment/delete', function(req, res){
    CommentModel.remove({ id : req.body.comment_id } , function(err){
        res.json({ message : "success" });
    });
});

router.get( '/edit/:id' ,loginRequired, csrfProtection, function(req, res){
    PostModel.findOne({ id : req.params.id }, function(err, post){
        res.render('posts/form', { post : post, csrfToken : req.csrfToken() }); 
    });
});

router.post( '/edit/:id',loginRequired, upload.single('thumbnail'), csrfProtection,  function(req, res){
    //그 이전 파일명을 먼저 받아온다.
    PostModel.findOne( {id : req.params.id} , function(err, post){
        
        if(req.file){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + post.thumbnail );
        }

        var query = {
            title : req.body.title,
            content : req.body.content,
            thumbnail : (req.file) ? req.file.filename : post.thumbnail,
            username : req.user.displayname
        };
        var post = new PostModel(query);
        if(!post.validateSync()){
            PostModel.update({ id : req.params.id }, { $set : query }, function(err){
                res.redirect('/posts/detail/' + req.params.id );
            });
        }
    });
});

router.get('/delete/:id', function(req,res){
    PostModel.remove( { id : req.params.id }, 
        function(err){
            res.redirect('/posts');
        });
});















module.exports = router;