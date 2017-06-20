var homework = require('../schemas/homework.js');
var boom = require('boom');
var seccion = require('../schemas/seccion.js');

exports.createHomework = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro']
	// },
	auth: false,
	handler : function(request, reply) {
		var newHomework = new homework({
			id : request.payload.id,
			seccion : request.payload.seccion,
			titulo : request.payload.titulo,
			fecha_de_envio : request.payload.fecha_de_envio,
			fecha_de_entrega : request.payload.fecha_de_entrega,
			descripcion : request.payload.descripcion,
			porcentaje_obtenido : request.payload.porcentaje_obtenido,
			parcial : request.payload.parcial,
			valor : request.payload.valor
		});
		newHomework.save(function(err){
			if(err){
				return reply({message: boom.wrap(err, 'Failed to insert Homework'), success: false});
			}else{
				return reply({message: 'Homework inserted succesfully to DB', success: true});
			}
		});
	}
}

exports.getAllHomeworks = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro', 'admin']
	// },
	auth: false,
	handler: function(request, reply){
		homework.find({}, function(err, tareas){
			if(!err && tareas){
				return reply({tareas: tareas, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo tareas'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getHomeworksByParcial = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		homework.find({parcial: request.params.parcial}, function(err, tareas){
			if(!err && tareas){
				return reply(tareas);
			}else if(!err){
				return reply(boom.notFound());
			}else if(err){
				return reply(boom.wrap(err, 'Error obteniendo tareas'));
			}
		});
	}
}

exports.getHomeworkById = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler: function(request, reply){
		console.log(request.payload.username);
		homework.findOne({id: request.params.id}, function(err, tareas){
			if(!err && tareas){
				return reply({tarea: tareas, success:true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo tareas'), success: false});
			}
		});
	}
}

exports.getHomeworkByMongoId = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler: function(request, reply){
		homework.find({_id: request.params.id}, function(err, tareas){
			if(!err && tareas){
				return reply({tareas: tareas, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo tareas'), success: false, tipo: 'error'});
			}
		});
	}
}

exports.getHomeworksBySeccion = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler: function(request, reply){
		homework.find({seccion: request.params.seccion}, function(err, tareas){
			if(!err && tareas){
				return reply({tareas: tareas, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: true});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo tareas'), succes: true});
			}
		});
	}
}

exports.modifyHomework = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		homework.update(
			{ _id : request.params.id }, 
			{ 
				$set: {
					id : request.payload.id,
					seccion : request.payload.seccion,
					titulo : request.payload.titulo,
					fecha_de_envio : request.payload.fecha_de_envio,
					fecha_de_entrega : request.payload.fecha_de_entrega,
					descripcion : request.payload.descripcion,
					porcentaje_obtenido : request.payload.porcentaje_obtenido,
					parcial : request.payload.parcial,
					valor : request.payload.valor
				} 
			},
			function(err){
				if(err){
					return reply({message: boom.notFound(), success: false, tipo:'notFound'});
				}else{
					return reply({message:'Tarea modificada con exito!', success: true});
				}
			}
		);
	}
}

exports.deleteHomework = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		homework.findOne( { _id: request.params.id }, function(err, tarea){
			if(!err && tarea){
				tarea.remove(function(err){
					if(!err){
						return reply({message: 'Tarea eliminada con exito!', success: true});
					}else if(err){
						return reply({message: boom.wrap(err, 'Error borrando la tarea'), success: false, tipo:'errorDelete'});
					}
				});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo la tarea: No se puedo borrar'), success:false, tipo:'errorFind'});
			}
		});
	}
}

