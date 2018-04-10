////////////////////////////////////
// ------- Set Up Requires ------ //
////////////////////////////////////


var express 	= require('express'); 
var app 		= express();
var bodyParser 	= require('body-parser'); 
var morgan		= require('morgan');
var sequelize 	= require('sequelize');
var env 		= process.env.NODE_ENV || "development";
var config 		= require('./config.js')[env];
var path 		= require('path');
var mw 			= require('./app/routes/middleware.js');

 
////////////////////////////////////
// --------- Set Up App --------- //
////////////////////////////////////

app.disable("etag");

var path = require('path');
global.appRoot = path.resolve(__dirname);

////////////////////////////////////
// --------- Set Up CORS -------- //
////////////////////////////////////

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(function(req, res, next){
	
	
	if(req.headers['x-error-type']){
		res.setHeader('x-error-type', req.headers['x-error-type']);
	}
	next();
	
});

////////////////////////////////////
// ------ Set Up Middleware ----- //
////////////////////////////////////

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 
app.use(express.static(__dirname + '/public'));

////////////////////////////////////
// -------- Import Routes ------- //
////////////////////////////////////

app.use('/api',require('./app/routes'));

app.get('/servermode', function(req, res){ 
	
	res.json({	
		success	: true,
		env		: env,
		data	: config.s3Bucket
	});
});



////////////////////////////////////
// ------ Catch All Route ------- //
////////////////////////////////////


app.get('*', function(req, res){ 
	
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
	
});

////////////////////////////////////
// ---- Set Up Server Listen ---- //
////////////////////////////////////


app.listen(config.port, function(){ 
	
	
	console.log("Server listening on " + config.port);
});








