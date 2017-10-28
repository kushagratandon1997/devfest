var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var flag = new schema({

	name:{
		type:'string',
		required:true
	},
	age:{
		type:'string',
		required:true
	},
	password:{
		type:'string',
	},
	phoneno:{
		type:'string',
		required:true,
		unique:true
	},
	email:{
		type:'string',
		required:true
	},
	amount:{
		type:'number',
		default:0
	},
	tripdesc:{
		type:'string'
	},
	reciept:[{
		type:schema.Types.ObjectId,
		ref:'reciept'
	}]

});

flag.methods.hashAndSave = function(){
	this.password = bcrypt.hashSync(this.password);
	return this.save();
}

module.exports = mongoose.model('employee',flag);