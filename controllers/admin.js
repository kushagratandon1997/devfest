var Admin = require('./../models/admin.js');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var jwt = require('./../jwt.js');

router.post('/create',(req,res)=>{
	Admin.create({username:req.body.username}).then((result)=>{
		result.password = req.body.password;
		result.save().then(()=>{
			return res.json('Created');
		},()=>{
			return res.status(400).json({err:"Bad Request."});
		});
	}).catch((err)=>{
		return res.json('Error Creating.');
	});

});

router.post('/login',(req,res)=>{

	Admin.findOne({username:req.body.username}).then((result)=>{
		if(!result){
			return res.status(401).json({err:"Invalid Username/Password."});
		}
		if(bcrypt.compareSync(req.body.password,result.password)){
			return res.status(200).json({msg:"Logged In.",jwt:jwt.issue({admin:true})});
		}
		return res.status(401).json({err:"Invalid Username/Password"});
	}).catch((err)=>{
		return res.status(500).json({err:"Error Logging In."});
	});

});

module.exports = router;