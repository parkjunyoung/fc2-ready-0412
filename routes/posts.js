var express = require('express');
var router = express.Router();
var PostModel = require('../models/PostModel');
var CommentModel = require('../models/CommentModel');

router.get('/' , function(req, res){
    PostModel.find().sort({ created_at : -1 }).exec(function(err, posts){
        res.render('posts/list', { posts : posts });
    });
});

router.get('/write', function(req, res){
    res.render('posts/form', { post : "" });
});

router.post('/write', function(req, res){
    var post = new PostModel({
        title : req.body.title,
        content : req.body.content
    });
    post.save( function(err){
        res.redirect('/posts');
    });
});

router.get('/detail/:id' , function(req, res){
    PostModel.findOne( { id : req.params.id }, function(err, post){
        res.render('posts/detail', { post : post });
    });
});

router.get( '/edit/:id' , function(req, res){
    PostModel.findOne({ id : req.params.id }, function(err, post){
        res.render('posts/form', { post : post }); 
    });
});

router.post( '/edit/:id', function(req, res){
    var query = {
        title : req.body.title,
        content : req.body.content
    };
    PostModel.update( { id : req.params.id } 
    , { $set : query }, function(err){
        res.redirect('/posts/detail/' + req.params.id);
    });
});

router.get('/delete/:id', function(req,res){
    PostModel.remove( { id : req.params.id }, 
        function(err){
            res.redirect('/posts');
        });
});















module.exports = router;