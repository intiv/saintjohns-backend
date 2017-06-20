var mongoose = require('mongoose');


var Alumno = new mongoose.Schema({
	cuenta : String,
	nombre : String,
	id_padre: String
	
});

module.exports = mongoose.model('alumno', Alumno);