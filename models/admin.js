var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var flag = new schema({

	username:{
		type:'string',
		unique:true
	},
	password:{
		type:'string',
	}

});

flag.pre('save',function(next){
	this.password = bcrypt.hashSync(this.password);
	next();
});

module.exports = mongoose.model('admin',flag);
