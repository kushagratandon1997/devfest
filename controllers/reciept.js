var express = require('express');
var router = express.Router();
var Employee = require('./../models/employee.js');
var Reciept = require('./../models/reciept.js');
var jwt = require('./../jwt.js');

router.post('/add',(req,res)=>{
	var token = req.headers.authorization.split(' ');
	if(token.length<2 || token[0]!="Bearer"){
		return res.status(409).json({err:"No Authorization Header Was Found."});
	}
	var decoded = jwt.decode(token[1]);
	var uid;
	if(jwt.verifySync(token[1])){
		uid = decoded.uid;
	}
	else{
		uid = "";
	}
	Employee.findOne({_id:uid}).then((emp)=>{
		if(!emp){
			return res.status(401).json({err:"Unauthorized."});
		}
		if(emp.amount < req.body.amount){
			return res.status(409).json({err:"Out Of Budget."});
		}
		Reciept.create({url:req.body.url}).then((result)=>{
			var date = new Date();
			var day = date.getDay()+1;
			var month = date.getMonth()+1;
			var year = date.getFullYear();
			result.lat = req.body.lat;
			result.lng = req.body.lng;
			result.date = day + '/' + month + '/' + year;
			result.time = date.getTime();
			result.desc = req.body.desc;
			result.save().then(()=>{
				emp.reciept.push(result);
				emp.amount = emp.amount - parseInt(req.body.amount);
				emp.save();
				return res.status(200).json({msg:"Uploaded Successfully."});
			}).catch(()=>{
				return res.status(400).json({err:"Bad Request."});
			});
		}).catch((err)=>{
			console.log(err);
			return res.status(500).json({err:"Something Went Wrong."});
		});
	}).catch((err)=>{
		return res.status(500).json({err:"Something Went Wrong."});
	});

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
	Reciept.findOne({_id:req.body.id}).then((result)=>{
		if(!result){
			return res.status(409).json({err:"No Such Entry."});
		}
		return res.status(200).json({result:result});
	}).catch((err)=>{
		return res.status(500).json({err:"Error Occured."});
	})

});

module.exports = router;