var mongoose = require('mongoose');

var skillsSchema = new mongoose.Schema({
	technology: String,
	percentage: String
});

mongoose.model('Skills', skillsSchema);