var express = require('express');
var router = express.Router();
var Employee = require('./../models/employee.js');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('./../jwt.js');

router.post('/create',(req,res)=>{

	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var admin;
	if(jwt.verifySync(token[1])){
		admin = decoded.admin;
	}
	else{
		admin = "";
	}
	if(!admin || admin==""){
		return res.status(401).json({err:"You Are Not An Admin."});
	}
	Employee.create({name:req.body.name,age:req.body.age,phoneno:req.body.phoneno,email:req.body.email}).then((result)=>{
		var rand = Math.floor(1000+Math.random()*2000);
		result.age = req.body.age;
		result.phoneno = req.body.phoneno;
		result.email = req.body.email;
		result.password = rand;
		console.log(result);
		result.hashAndSave().then((result)=>{
			return res.status(200).json({msg:"Employee Added."});
		});
	}).catch((err)=>{
		console.log(err);
		return res.status(500).json({err:"Error Creating employee."});
	})

});

router.post('/login',(req,res)=>{

	Employee.findOne({phoneno:req.body.phoneno}).then((result)=>{
		if(!result){
			return res.status(401).json({err:"Invalid Username/Password."});
		}
		if(bcrypt.compareSync(req.body.password,result.password)){
			return res.status(200).json({msg:"Logged In.",jwt:jwt.issue({uid:result._id})});
		}
		return res.status(401).json({err:"Invalid Username/Password."});
	}).catch((err)=>{
		console.log(err);
		return res.status(500).json({err:"Error Logging In."});
	})

});

router.post('/get',(req,res)=>{


	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var admin;
	if(jwt.verifySync(token[1])){
		admin = decoded.admin;
	}
	else{
		admin = "";
	}
	Employee.findOne({_id:req.body.id}).populate('reciept').then((result)=>{
		if(!result){
			return res.status(409).json({err:"No User Found."});
		}
		var result = result.reciept.map((dummy)=> dummy._id);
		return res.status(200).json({result:result});
	}).catch((err)=>{
		return res.status(500).json({err:"Something Went Wrong."});
	})

});

router.post('/addtrip',(req,res)=>{

	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var admin;
	if(jwt.verifySync(token[1])){
		admin = decoded.admin;
	}
	else{
		admin = "";
	}
	if(!admin || admin==""){
		return res.status(401).json({err:"You Are Not An Admin."});
	}
	Employee.findOne({_id:req.body.id}).then((result)=>{
		if(!result){
			return res.status(404).json({err:"No Such User."});
		}
		result.amount = req.body.amount;
		result.tripdesc = req.body.tripdesc;
		result.save();
		return res.status(200).json({msg:"Trip Added."});
	}).catch((err)=>{
		return res.status(500).json({err:"Something Went Wrong."});
	})

});

router.post('/getdet',(req,res)=>{

	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var admin;
	if(jwt.verifySync(token[1])){
		admin = decoded.admin;
	}
	else{
		admin = "";
	}
	if(!admin || admin==""){
		return res.status(401).json({err:"You Are Not An Admin."});
	}
	Employee.find({},{phoneno:1,_id:1,name:1}).then((result)=>{
		return res.status(200).json({result:result});
	});

});

module.exports = router;