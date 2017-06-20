var message = require('../schemas/message');
var boom = require('boom');

exports.createMessage = {
	handler : function(request, reply){
		var newMessage = new message({
			senderID : request.payload.senderID;
			receivers : request.payload.receivers;
			topic : request.payload.topic;
			body : request.payload.body;
			sendDate : request.payload.sendDate;
		});
		newMessage.save(function(err){
			if(err){
				return reply('Error saving message to DB');
			}else{
				return reply('Message inserted succesfully');
			}
		});
	}
}