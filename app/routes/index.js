////////////////////////////////////
// ------- Set Up Requires ------ //
////////////////////////////////////

var express = require('express');
var router 	= express.Router();
var mw 		= require('./middleware.js');

////////////////////////////////////
// ----- Declare Route Files ---- //
////////////////////////////////////

router.use('/auth', require('./auth'));
router.use('/users', require('./users')); 
router.use('/articles', require('./articles'));
//router.use('/galleries', require('./galleries'));
router.use('/categories', require('./categories'));
router.use('/activities', require('./activities'));
router.use('/images', require('./images'));
router.use('/comments', require('./comments'));
router.use('/messages', require('./messages'));
//router.use('/reviews', require('./reviews'));


router.use('/me', mw.isAuthenticated('User'), function(req, res){
	
	res.send(req.user);
});


////////////////////////////////////
// -------- Export Module ------- //
////////////////////////////////////

module.exports = router;


////////////////////////////////////
// ---- Middleware Functions ---- //
////////////////////////////////////





