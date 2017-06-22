var user = require('../schemas/user');
var student = require('../schemas/alumno');
var joi = require('joi');
var SHA3 = require('crypto-js/sha3');
var boom = require('boom');
// var client = require('ftp');
// var fs = require('fs');
// var c = new Client();
// var gclient = require('googleapis');
// var oauth2=gclient.auth.OAuth2;
// var oauth2client = new oauth2(
// 	'449932713512-8mona5h904ro96pf09vph00pn32mk23h.apps.googleusercontent.com',
// 	'XQ3qC6GyugXfxK9L2KiUPODr',
// 	'http://localhost:8080/#/test'
// );


/*
,gconfig={
	CLIENT_ID: '107306606676244887920',
	CLIENT_SECRET: 'XQ3qC6GyugXfxK9L2KiUPODr',
	SERVICE_EMAIL: 'intiv-551@saint-johns-170923.iam.gserviceaccount.com',
	JSON_FILE_PATH: './saint johns-0b00034b95eb.json'

},
jwtClient=new gclient.auth.JWT(
	gconfig.CLIENT_ID,
	gconfig.JSON_FILE_PATH,
	gconfig.CLIENT_SECRET,
	[
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/admin.reports.audit.readonly'
	],
	gconfig.SERVICE_EMAIL
);*/

//added = agregado a routes
exports.createUser = {//added
	auth: false,
	handler : function(request, reply){
		if(request.payload.tipo === 'maestro'||request.payload.tipo === 'padre'||request.payload.tipo ==='alumno'||request.payload.tipo==='admin'){
			var newUser = new user({
				id : request.payload.id,
				nombre : request.payload.nombre,
				apellido : request.payload.apellido,
				usuario : request.payload.usuario,
				tipo : request.payload.tipo,
				contrasena : SHA3(request.payload.contrasena),//SHA3(request.payload.contrasena)
				fecha_de_nacimiento : request.payload.fecha,
				telefono : request.payload.telefono,
				direccion : request.payload.direccion,
				correo : request.payload.correo,
				scope: request.payload.scope
			});
			newUser.save(function(err){
				if(err){
					return reply({message: boom.notAcceptable('Username must be unique: ' + err), success: false});
				}else{
					return reply({ user:newUser ,message: 'User inserted succesfully', success: true});
				}
			});
		}else{
			return reply({message: boom.badRequest('Tipo de cuenta invalido'), success: false});
		}
	}
}

exports.login = {
  auth: false,
  validate: {
    payload: {
      usuario: joi.string().min(3).max(20).required(),
      contrasena: joi.string().min(3).max(20).required()
    }
  },
  handler: function(request, reply) {
    var contrasena = String(SHA3(request.payload.contrasena));
    user.find({usuario: request.payload.usuario, contrasena: contrasena}, function(err, User){
      	if(!err && User){
        if(User.length > 0){
        	request.cookieAuth.set(User[0]);
        	return reply({usuario: User[0].usuario, scope: User[0].scope, cuenta:User[0]._id,  success: true, message: 'Login hecho exitosamente'});
        }else{
          return reply({success: false, message: boom.notFound(),tipo: 'length'});
        }
      }else if(!err){
        return reply({success: false, message: 'No se encontro el usuario', tipo:'null'});
      }else if(err){
      	return reply({success: false, message: boom.wrap(err, 'Error obteniendo el usuario'), tipo:'err'});
      }
    });
  }
};

exports.logout = {
  auth : {
    strategy: 'session',
    mode: 'required'
  },
  handler: function(request, reply) {
    request.cookieAuth.clear();
    return reply('Logout Successful!');
  }
};

exports.getAllUsers = {//added
	handler : function(request, reply){
		user.find({}, function(err, users){
			if(!err && users){
				return reply({users: users, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: true});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo usuarios de la bd'), success: true});
			}
		});
	}
}

exports.getUserById = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin']
	// },
	auth: false,
	handler : function(request, reply){
		user.findOne({_id: request.params.id},function(err, User){
			if(!err && User){
				return reply({user: User, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el usuario de la bd (id)'), success: false});
			}
		});
	}
}

exports.getStudent = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['alumno', 'maestro','admin']
	// },
	auth: false,
	handler: function(request, reply){
		student.findOne({id_user: request.params.id}, function(err, Student){
			if(!err && Student){
				return reply({alumno: Student, success: true});	
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo: 'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo el estudiante de la bd (id)'), success: false, tipo: 'error'});
			}
		});
	}
}

exports.getUserByUsername = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['alumno', 'maestro', 'admin']
	// },
	auth: false,
	handler: function(request, reply){
		user.findOne({_id: request.params.usuario}, function(err, Usuario){
			if(!err && Usuario){
				return reply({usuario: Usuario, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false, tipo:'notFound'});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error cargando el usuario'), success: false, tipo:'error'});
			}
		});
	}
}

exports.getTeachers = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		user.find({tipo: 'maestro'}, function(err, Maestros){
			if(!err && Maestros){
				return reply({teachers : Maestros, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo maestros'), success: false});
			}
		});
	}
}

exports.getTeacherById = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['maestro','admin','alumno']
	// },
	auth: false,
	handler : function(request, reply){
		user.findOne({_id: request.params.id, tipo: 'maestro'}, function(err, Maestro){
			if(!err && Maestro){
				return reply({teacher: Maestro, success: true});
			}else if(!err){
				return reply({message: boom.notFound('No existe un maestro con esa id'), success: false});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo maestro'), success: false});
			}
		});
	}
}

exports.modifyUser = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		user.update(
			{'_id':request.params.id},
			{
				$set: {
					id : request.payload.id,
					nombre : request.payload.nombre,
					apellido : request.payload.apellido,
					usuario : request.payload.usuario,
					tipo : request.payload.tipo,
					contrasena : SHA3(request.payload.contrasena),
					fecha_de_nacimiento : request.payload.fecha,
					telefono : request.payload.telefono,
					direccion : request.payload.direccion,
					correo : request.payload.correo,
					scope: request.payload.scope
				}
			},
			function(err){
				if(err){
					return reply({message: boom.wrap(err, 'Usuario no encontrado'), success: false, tipo:'error'});
				}else{
					return reply({message: 'Usuario modificado con exito!', success: true});
				}
			}
		);
	}
}

exports.deleteUser = {//added
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		user.findOne(
			{'_id' : request.params.id},
			function(err, User){
				if(!err && User){
					User.remove(function(err){
						if(err){
							return reply({message: boom.wrap(err,'Error borrando el usuario'), success: false, tipo:'errorDelete'});
						}else{
							return reply({message: 'Usuario borrado con exito!', success: true});
						}
					})
				}else if(!err){
					return reply({message: boom.notFound(), tipo:'notFound', success: false});
				}else if(err){
					return reply({message: boom.wrap(err, 'Ocurrio un error borrando el usuario'), success: false, tipo:'errorFind'});
				}
			}
		);
	}
}
exports.getFiltro = {//added
	handler : function(request, reply){

		user.find({"apellido":{$regex: request.params.con},tipo:"maestro"}, function(err, users){
			if(!err && users){
				return reply({users: users, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: true});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo usuarios de la bd'), success: true});
			}
		});
	}
}
exports.getFiltro1 = {//added
	handler : function(request, reply){

		user.find({"apellido":{$regex: request.params.con},tipo:"alumno"}, function(err, users){
			if(!err && users){
				return reply({users: users, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: true});
			}else if(err){
				return reply({message: boom.wrap(err, 'Error obteniendo usuarios de la bd'), success: true});
			}
		});
	}
}
exports.getStudents = {
	// auth: {
	// 	mode: 'required',
	// 	strategy: 'session',
	// 	scope: ['admin']
	// },
	auth: false,
	handler : function(request, reply){
		user.find({tipo: 'alumno'}, function(err, Maestros){
			if(!err && Maestros){
				return reply({alumnos : Maestros, success: true});
			}else if(!err){
				return reply({message: boom.notFound(), success: false});
			}else if(err){
				return reply({message: boom.wrap(err,'Error obteniendo maestros'), success: false});
			}
		});
	}
}

// insertTest= function(drive){
// 	drive.files.create({
// 		resource: {
// 			name: 'Test',
// 			mimeType: 'text/plain'
// 		},
// 		media: {
// 			mimeType: 'text/plain',
// 			body: 'Ipsum Lorem!'
// 		}
// 	},
// 	function(err, resp) {
// 		if (err) {
			
// 			console.log('insert error: ', err);
// 		} else {
// 			console.log(drive.files.list());
// 			console.log('File created. See id following:',resp);
// 		}
// 	}
// 	);
// }

// exports.uploadFile = {
// 	handler: function(request, reply){
// 		var url=oauth2client.generateAuthUrl({
// 			access_type: 'online',
// 			scopes: ['https://www.googleapis.com/auth/drive']
// 		});
// 		console.log(url);
// 		oauth2client.getToken
// 		jwtClient.authorize(function(err, tokens) {
// 			if (err) {
// 				return reply("Error authorizing with JWT, "+err);
// 			}
// 			var drive = gclient.drive({
// 				version: 'v2',
// 				auth: jwtClient
// 			});
// 			insertTest(drive);
// 			return reply('FUNCIONO (probably not)')
// 		});
	
// 	}
// }

// exports.probarFTP = {
// 	handler: function(request, reply){
// 		c.on('ready', function(){
// 			c.list(function(err, list){
// 				if(err){
// 					throw err;
// 				}else{
// 					console.dir(list);
// 					c.end();
// 				}
// 			});
// 		});
// 	}
// }