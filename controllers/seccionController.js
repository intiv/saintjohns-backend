 var seccion = require('../schemas/seccion');
var SHA3 = require('crypto-js/sha3');
var boom = require('boom');

//added = agregado a rutas
exports.createSection = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		var newSeccion = new seccion({
			cuenta: request.payload.cuenta,
			grado: request.payload.grado,
			apartado: request.payload.apartado,
			ano: request.payload.ano,
			maestro:request.payload.maestro
		});
		newSeccion.save(function(err){
		if(err){
			return reply({message: 'Error guardando seccion en la DB', success: false});
		}else{
			return reply({message: 'Seccion guardada con exito', success: true});
		}
		});
	}
	
}

exports.getAllSections = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		seccion.find({}, function(err, secciones){
			if(!err && secciones){
				return reply({secciones: secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo las secciones de la bd'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getSectionById = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.findOne({_id: request.params.id}, function(err, seccion){
			if(!err && seccion){
				return reply({seccion: seccion, success:true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo la seccion de la bd'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getSectionsByTeacher = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.find({maestro : request.params.maestro}, function(err, secciones){
			if(!err && secciones){
				return reply({secciones: secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo las secciones de ese maestro'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getSectionsByGrade = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.find({grado : request.params.grado}, function(err, secciones){
			if(!err && secciones){
				return reply({secciones: secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo las secciones de ese grado'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getSectionsByYear = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.find({ano : request.params.ano}, function(err, secciones){
			if(!err && secciones){
				return reply({secciones: secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo las secciones de ese año'), success: false, tipo:'error'});
			}
		});
	}	
}

exports.getSectionByCuenta = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.findOne({cuenta : request.params.cuenta}, function(err, seccion){
			if(!err && seccion){
				return reply({seccion: seccion, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo la seccion de esa cuenta'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getSectionsByApartado = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','alumno','admin']
	// },
	handler: function(request, reply){
		seccion.find({apartado : request.params.apartado}, function(err, secciones){
			if(!err && secciones){
				return reply({secciones: secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo las secciones de ese apartado'), success: false, tipo:'error'});
			}
		});
	}
}


exports.modifySection = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler : function(request, reply){
		seccion.update(
			{ _id :request.params.id},
			{
				$set: {
				cuenta: request.payload.cuenta,
				grado: request.payload.grado,
				apartado: request.payload.apartado,
				ano: request.payload.ano,
				maestro:request.payload.maestro	
				}
			},
			function(err){
				if(err){
					return reply({message: boom.wrap(err, 'seccion no se ha encontrado'), success: false});
				}else{
					return reply({message: 'Seccion se ha modificado con exito!', success: true});
				}
			}
		);
	}
}

exports.deleteSection = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		seccion.findOne(
			{ _id : request.params.id},
			function(err, Seccion){
				if(!err && Seccion){
					Seccion.remove(function(err){
						if(err){
							return reply({message: boom.wrap(err,'Error borrando la seccion'), success: false, tipo:'errorDelete'});
						}else{
							return reply({message: 'Seccion borrada con exito!', success: true});
						}
					});
				}else if(!err){
					return reply({message: boom.notFound(), success: false, tipo:'notFound'});
				}else if(err){
					return reply({message: boom.wrap(err, 'No se pudo eliminar la seccion de la bd'), success: false, tipo:'errorFind'});
				}
			}
		);
	}
}

exports.assignTeacher = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		seccion.update(
			{ cuenta: request.params.cuenta },
			{
				$set : {
					maestro: request.payload.maestro
				}
			},
			function(err){
				if(err){
					return reply({message: boom.wrap(err, 'No se pudo asignar el maestro a la seccion'), success: false});
				}else{
					return reply({message: 'Maestro asignado a la seccion con exito',success: true})
				}
			}
		);
	}
}

exports.getSeccion = {
	// auth : {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin','alumno','maestro']
	// },
	auth: false,
	handler : function(request, reply){
		seccion.findOne({
			cuenta: request.query.cuenta, 
			grado: request.query.grado,
			ano:request.query.year, 
			apartado: request.query.apartado
		}, function(err, Seccion){
			if(!err && Seccion){
				return reply({seccion: Seccion, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo Seccion'), success: false, tipo:'error'});
			}
		});
	}
}


exports.modifyInfo = {
	auth: false,
	handler: function(request, reply){
		seccion.update(
			{_id: request.params.id},
			{
				$set: {
					info: request.payload.info
				}
			},
			function(err){
				if(err){
					return reply({message: boom.wrap(err, 'Error modificando info de la seccion'), success: false});
				}else{
					return reply({message: 'Informacion de la seccion modificada con exito!', success: true});
				}
			}
		);
	}
}

exports.getSeccionesForUser = {
	// auth : {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin','alumno','maestro']
	// },
	auth: false,
	handler: function(request, reply){
		seccion.find({
			grado: request.query.grado,
			ano: request.query.year,
			apartado: request.query.apartado
		}, function(err, Secciones){
			if(!err && Secciones){
				return reply({secciones: Secciones, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo Seccion'), success: false, tipo:'error'});
			}
		});

	}
}

