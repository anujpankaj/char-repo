var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port= process.env.PORT || 3000;
const { Client }= require('pg');
//Code for whitelist all URL
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

//Code for make connection from DB
const client= new Client({

     connectionString: process.env.DATABASE_URL,
     ssl: true,
});
client.connect();

//Code for redirect application on default page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	/*console.log('a user connected');
	socket.on('disconnect', function(){
		console.log	('user disconnected');
	});*/
	//socket.on('db message', function(msg){
		//Send single message
       //console.log('message: ' + msg);
      //Fetch data from data base
     client.on('notification', function(msg) {
      console.log(msg);
      socket.emit('db message', msg);
     });
     var query = client.query("LISTEN watchers");     

   // });
});

http.listen(port, function(){
  console.log('listening on *:'+ port);
});