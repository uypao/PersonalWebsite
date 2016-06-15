angular.module('mainModule', ['ngResource'])

// .factory('messageService', function($resource){
// 	return $resource('api/messages');
// })

.controller('mainCtrl',function(messageService){

	$.stellar({
	    horizontalScrolling: false,
	    responsive: true
	});

	$('.back-to-top').click(function () {
	  $('html, body').animate({
	    scrollTop: 0
	  }, 1000);
	  return false;
	});

	$('body').imagesLoaded( function() {	   
		// $body.removeClass('loading');

		// $('#slide-1').parallax({imageSrc: 'img/laptop_room.jpg'});
		// $('#slide-2').parallax({imageSrc: 'img/three-side.jpg'});
	});

	$(document).scroll(function() {
		if ( $(window).scrollTop() > 300 ) {
			$('a.back-to-top').fadeIn('slow');
		} else {
			$('a.back-to-top').fadeOut('slow');
		}
	});

	this.sendMessage = function(){
		var self = this;	
		self.emailMsg = '';
		self.sendMsg  = '';
		if (!self.validateEmail(self.messages.email)){
			self.emailMsg = 'Please enter a valid Email Address';
		} else {
			messageService.save(self.messages, function(data){
				self.messages = null;
				self.emailMsg = '';
				self.sendMsg = 'Thank you for your message!';
			});
		}
	};

	this.validateEmail = function (email) {
   		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	};
})

.factory('skillsService', function($resource){
	return $resource('api/skills');
})

.controller('skillsCtrl', function(skillsService){
	var self = this;
	skillsService.query(function(data){
		self.skills = data;
	}, function(err){
		console.log('error on /skills');
	});


});

