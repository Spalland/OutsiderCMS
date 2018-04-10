////////////////////////////////////
// ------- Require Modules ------ //
////////////////////////////////////

var express = require('express');
var router 	= express.Router(); 
var db 		= require('../models/index');
var mw 		= require('./middleware.js');
	
////////////////////////////////////
// ------- Declare Routes ------- //
////////////////////////////////////


// INTERNAL MESSAGES FUNCTIONALITY 