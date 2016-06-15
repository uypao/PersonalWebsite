var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var message = mongoose.model('Message');
var skill = mongoose.model('Skills');

function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if(req.method === "POST"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	return res.send(302, 'user not authenticated');
};

router.use('/messages', isAuthenticated);
router.use('/skills/:skill_id', isAuthenticated);

router.route('/messages')
	.get(function(req, res){
		message.find(function(err, data){
			if (err){				
				return res.send(500, err);
			}
			console.log('return data');
			return res.send(data);
		});
	})
	.post(function(req, res){
		var newMessage = new message();
		newMessage.name = req.body.name;
		newMessage.email = req.body.email;
		newMessage.message = req.body.message;
		newMessage.save(function(err, data){
			if (err){
				return res.send(500, err);
			}
			return res.json(data);
		});
	});

router.route('/skills')
	.get(function(req, res){
		skill.find(function(err, data){
			if (err){				
				return res.send(500, err);
			}
			console.log('return data');
			return res.send(data);
		});
	})
	.post(function(req, res){
		var newSkill = new skill();
		newSkill.technology = req.body.technology;
		newSkill.percentage = req.body.percentage;
		newSkill.save(function(err, data){
			if (err){
				return res.send(500, err);
			}
			return res.json(data);
		});
	});

router.route('/skills/:skill_id')
	.delete(function(req, res){
		skill.remove({
			_id: req.params.skill_id
		}, function	(err, data){
			if (err){
				return res.send(500, err);
			}
			return res.json(data);
		});
	})

	.put(function(req, res){
		skill.findById(req.params.skill_id, function(err, data){
			if (err){
				res.send(err);
			}
			data.technology	= req.body.technology;
			data.percentage	= req.body.percentage;

			data.save(function(err){
				if (err){
				res.send(err);
				}
				res.json(data);
			})
		});
	});

module.exports = router;
