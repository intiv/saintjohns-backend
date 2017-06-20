var entrega = require('../schemas/entrega');
var boom = require('boom');

exports.createEntrega = {
	// auth: {
	// 	mode: 'required',
	// 	type: 'session',
	// 	scope: ['alumno']
	// },
	auth: false, 
	handler: function(request, reply){
		var Entrega =new entrega({
			id_Tarea: String,
			id_alumno: String,
			url: String
		});
		Entrega.save(function(err){
			if(!err){
				return reply({message: 'Entrega subida con exito!', success: true});
			}else{
				return reply({message: boom.wrap(err, 'No se pudo guardar la entrega'), success: false});
			}
		});
	}
}

exports.getAllEntregas = {
	// auth: {
	// 	mode: 'required',
	// 	type: 'session',
	// 	scope: ['alumno']
	// },
	auth: false,
	handler: function(request, reply){
		entrega.find({}, function(err, Entregas){
			if(!err && Entregas){
				return reply({message: 'Entregas obtenidas con exito', entregas: Entregas, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo entregas. Revise su conexion'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getEntregasByTarea = {
	// auth: {
	// 	mode: 'required',
	// 	type: 'session',
	// 	scope: ['maestro']
	// },
	auth: false,
	handler: function(request, reply){
		entrega.find({id_tarea: request.query.id_tarea, seccion: request.query.seccion}, function(err, Entregas){
			if(!err && Entregas){
				return reply({message: 'Entregas obtenidas con exito', entregas: Entregas, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo entregas. Revise su conexion'), success: false, tipo:'error'});
			}	
		});
	}
}

exports.modifyEntrega = {
	// auth: {
	// 	mode: 'required',
	// 	type: 'session',
	// 	scope: ['admin','alumno']
	// },
	auth: false,
	handler: function(request, reply){
		entrega.update(
			{_id:request.params.id},
			{
				$set: {
					id_tarea: request.payload.id_tarea,
					seccion: request.payload.seccion,
					parcial: request.payload.parcial,
					fecha_de_envio: request.payload.fecha_de_envio,
					url: request.payload.url,
					puntos: request.payload.puntos
				}
			},
			function(err){
				if(!err){
					return reply({message: 'Entrega modificada con exito!', success: true});
				}else if(err){
					return reply({message: boom.wrap(err, 'Error al modificar la entrega!'),success: false});
				}
			}
		);
	}
}

exports.deleteEntrega = {
	// auth: {
	// 	mode: 'required',
	// 	type: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler: function(request, reply){
		entrega.findOne({_id: request.params.id}, function(err, Entrega){
			if(!err && Entrega){
				Entrega.remove(function(err){
					if(!err){
						return reply({message: 'Entrega eliminada con exito', success: true});
					}else if(err){
						return reply({message: boom.wrap(err, 'Error eliminando la entrega!'),success: false, tipo: 'errorDelete'});
					}
				});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo la entrega! Revise su conexion a internet'),success: false, tipo:'errorFind'});
			}
		});
	}
}