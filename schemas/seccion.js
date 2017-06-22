var mongoose = require('mongoose');

var SeccionSchema = new mongoose.Schema({
	cuenta: String,
	grado : String,
	apartado : String,
	ano: String,
	maestro: String,
	info: String
});

module.exports = mongoose.model('seccion', SeccionSchema);