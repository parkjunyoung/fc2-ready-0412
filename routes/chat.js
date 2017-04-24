var router = require('express').Router();

router.get('/', function(req,res){
    res.render('chat/chat');
});

module.exports = router;