var student = require('../schemas/alumno');

exports.createStudent = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		var newStudent = new student({
			cuenta : request.payload.cuenta,
			nombre : request.payload.nombre,
			id_padre : request.payload.id_padre,
			id_user: request.payload.id_user
		});
		newStudent.save(function(err){
			if(err){
				return reply(boom.wrap({message: err, success: false, tipo: 'error'}));
			}else{
				return reply({message: 'Alumno creado con exito!', success: true});
			}
		});
	}
}

exports.getAllStudents = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler : function(request, reply){
		student.find({}, function(err, students){
			if(!err && students){
				return reply({student: students, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo usuarios de la bd'), success:false, tipo:'error'});
			}
		});
	}
}

exports.getStudentById = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler : function(request, reply){
		student.findOne({_id: request.params.id},function(err, Student){
			if(!err && Student){
				return reply({student: Student, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el estudiante de la bd (id)'), success: false, tipo: 'error'});
			}
		});
	}
}
exports.getStudentByIdu = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler : function(request, reply){
		student.findOne({id_user: request.params.id},function(err, Student){
			if(!err && Student){
				return reply({student: Student, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el estudiante de la bd (id)'), success: false, tipo: 'error'});
			}
		});
	}
}

exports.getStudentByAccount = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler : function(request, reply){
		student.findOne({cuenta: request.params.cuenta},function(err, Student){
			if(!err && Student){
				return reply({student: Student, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el usuario de la bd'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getStudentsByName = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler : function(request, reply){
		student.find({nombre: request.params.nombre},function(err, students){
			if(!err && students){
				return reply({students: students, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el usuario de la bd'), success: false, tipo:'error'});
			}
		});
	}
}

exports.modifyStudent = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler: function(request, reply){
		student.update(
			{'_id':request.params.id},
			{
				$set: {
					cuenta: request.payload.cuenta,
					nombre: request.payload.nombre,
					id_padre: request.payload.id_padre,
					id_user: request.payload.id_user
				}
			},
			function(err){
				if(err){
					return reply({message : boom.wrap(err, 'Alumno no encontrado'), success: false, tipo: 'error'});
				}else{
					return reply({message: 'Alumno modificado con exito!', success: true});
				}
			}
		);
	}
}

exports.deleteStudent = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler: function(request, reply){
		student.findOne(
			{'_id' : request.params.id},
			function(err, Student){
				if(!err && Student){
					Student.remove(function(err){
						if(err){
							return reply({message: boom.wrap(err, 'Ocurrio un error al intentar borrar el alumno'), success: false, tipo: 'errorDelete'});
						}else{
							return reply({message: 'Alumno borrado con exito!', success: true});
						}
					});
				}else if(!err){
					return reply({message: boom.notFound(), success: false, tipo:'notFound'});
				}else if(err){
					return reply({message: boom.badRequest('No se puedo borrar el alumno'),tipo:'errorFind', success: false});
				}
			}
		);
	}
}