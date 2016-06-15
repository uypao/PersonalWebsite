var mongoose = require('mongoose');

var messagesSchema = new mongoose.Schema({
	name: String,
	email: String,
	message: String
});

mongoose.model('Message', messagesSchema);