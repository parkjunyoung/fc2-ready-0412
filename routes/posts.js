var express = require('express');
var router = express.Router();

router.get('/' , function(req, res){
    res.render('posts/list');
});

router.get('/write', function(req, res){
    res.send('posts write');
});

module.exports = router;