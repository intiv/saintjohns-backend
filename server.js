var hapi = require('hapi');
var routes = require('./routes/routes');
var mongoose = require('mongoose');
var inert = require('inert');
var auth = require('hapi-auth-cookie');

var server = new hapi.Server();
server.connection({
	port: ~~process.env.PORT || 8000,
	routes : {
		cors : {
			credentials: true,
			origin : ["*"]
		}
	}
});

mongoose.connect('mongodb://admin:admin@ds129422.mlab.com:29422/saintjohns');

var db=mongoose.connection;
db.on('error', console.error.bind(console, 'Connection to MongoDB failed'));
db.once('open', function callback(){
	console.log('Connection with MongoDB succeeded');
});

server.register([inert, auth], function(err){
	
	server.auth.strategy('session', 'cookie',{
		password: 'cookie-auth-password-for-encryption',
		cookie: 'saint-johns-cookie',
		ttl: 3 * 60 * 60 * 1000,
		isSecure: false
	});
	server.route(routes.endpoints);
	server.start(function(){
		console.log('Server start succesful, connected at: ' + server.info.uri);
	});

});

var google=require('googleapis');
var oauth2=google.auth.OAuth2;

var oauth2Client = new oauth2(
	'449932713512-8mona5h904ro96pf09vph00pn32mk23h.apps.googleusercontent.com', //()
	'secreto',	//secret (?)
	'http:localhost:8000' //redirect uri (?)
);

var url=oauth2Client.generateAuthUrl({
	access_type: 'online',
	scope: 'https://www.googleapis.com/auth/drive'
});