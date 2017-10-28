var mongoose = require('mongoose');
var schema = mongoose.Schema;

var flag = new schema({

	url:{
		type:'string'
	},
	lng:{
		type:'string'
	},
	lat:{
		type:'string'
	},
	date:{
		type:'string'
	},
	time:{
		type:'string'
	},
	desc:{
		type:'string'
	}

});

module.exports = mongoose.model('reciept',flag);