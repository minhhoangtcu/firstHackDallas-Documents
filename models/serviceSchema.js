var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var service = new Schema({
		name:  {
			type: String,
			required: true
		},
		address: String,
		phone:   String,
		hour: String,
		website: String,
		description: String
	}
});

var Service = mongoose.model('Service', service);

module.exports = Dishes;