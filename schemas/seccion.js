var mongoose = require('mongoose');

var SeccionSchema = new mongoose.Schema({
	cuenta: String,
	grado : String,
	apartado : String,
	ano: String,
	maestro: String
});

module.exports = mongoose.model('seccion', SeccionSchema);