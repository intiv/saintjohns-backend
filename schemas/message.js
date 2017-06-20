var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	emisor: String,
	recibidores:[String],
	titulo: String,
	fecha_de_envio: String
});

module.exports = mongoose.model('messages', MessageSchema);