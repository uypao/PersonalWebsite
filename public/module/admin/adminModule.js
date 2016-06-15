angular.module('adminModule', ['ngResource', 'xeditable'])

.factory('skillsService', function($resource){
	return $resource('api/skills/:skill_id', {skill_id: "@skill_id" } , {
    update: {method: 'PUT'}});
})

.controller('adminMessageCtrl',function(messageService, $state){
	var self = this;
	$('.parallax-slider').hide();

	messageService.query(function(data){
		self.messages = data;
	}, function(err){
		// redirect to login page
		$state.transitionTo('login');
	});
})

.controller('adminSkillsCtrl', function(skillsService){
	var self = this;
	
	skillsService.query(function(data){
		self.techSkills = data;
	}, function(err){
		console.log('error on /skills');
	});

	this.addSkills = function(){
		self.newSkill = {};
		self.techSkills.push(self.newSkill);
	};

	this.saveSkill = function(data, skillId){
		//update if skillId is defined
		if (skillId){
			skillsService.update({'skill_id': skillId}, data, function(data){
				console.log('successfully updated technology: ' + data.technology);
			});
		} else {
			skillsService.save(data, function(response){
			var newSkill = self.techSkills.filter(function(skill){ 
				return (skill.technology === response.technology &&
						skill.percentage === response.percentage)
			});
			newSkill[0]._id = response._id;
			console.log('successfully added a skill');
			});
		}
	};

	this.removeSkill = function(index){
		if (!self.techSkills[index]._id){
			return self.techSkills.splice(index, 1);
		}
		skillsService.delete({'skill_id': self.techSkills[index]._id}, function(data){
			console.log('skill ' + self.techSkills[index].technology + ' has been deleted');
			self.techSkills.splice(index, 1);
		});
		
	};
})

.controller('authCtrl', function($state, authService){
	var self = this;
	$('.parallax-slider').hide();
	self.loginFailed = false;

	this.login = function(){
		authService.login(self.user)
		.then(function(response){
			$state.transitionTo('admin');
		}, function(response){
			self.errormsg = response.data.message;
			self.loginFailed = true;
			self.user = null;
		});
	};

	this.logout = function(){
		authService.logout().then(function(){
			$state.transitionTo('login');	
		});		
	};
});