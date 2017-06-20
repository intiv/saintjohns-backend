var mongoose=require('mongoose');

var EntregaSchema = new mongoose.Schema({
	id_tarea: String,
	id_alumno: String,
	seccion: String,
	parcial: Number,
	fecha_de_envio: String,
	url: String,
	puntos: Number
})

module.exports = mongoose.model('entregas',EntregaSchema);