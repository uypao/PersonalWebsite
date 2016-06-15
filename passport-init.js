var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var user = mongoose.model('User');
var message = mongoose.model('Message');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:', user.username);
		//return the unique id for the user
		return done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(id, done) {
		user.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});

	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			user.findOne({
				username: username
			}, function(err, data){
				// In case of any error, return using the done method
				// if (err)
				// 	console.log('2');
				// 	return done(err);
				// Username does not exist, log the error and redirect back
				if (!data){
					console.log('User Not Found with username '+username);
					return done(null, false);                 
				}
				// User exists but wrong password, log the error 
				if (!isValidPassword(data, password)){
					console.log('Invalid Password');
					return done(null, false); // redirect back to login page
				}
				// User and password both match, return user from done method
				// which will be treated like success
				return done(null, data);
			});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			user.findOne({
				username: username
			}, function(err, data){
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err, false);
				}

				if (data){
					console.log('User already exists with username: '+username);
					return done(null, false);
				} else{
					var newUser = new user()
					newUser.username = username;
					newUser.password = createHash(password);

					newUser.save(function(err){
						if (err){
							return done(err, false);
						}
					console.log(newUser.username + ' Registration succesful');   
					return done(null, newUser);
				});
				}
			});
	
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
