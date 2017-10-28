const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname + '/../public')));
app.use(session({secret:'Deathadder1516',saveUninitialized:true,resave:true}));

app.set('views',path.join( __dirname + '/views' ));
app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/devfest',{useMongoClient:true},(err,db)=>{
	if(err){
		console.log('MongoDb Connection Error.');
		process.exit(0);
	}
	console.log('MongoDb Connected.');
});

app.listen(3000);
