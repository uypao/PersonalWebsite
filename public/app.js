'use strict';

angular.module('uyApp', [
	'mainModule'
	,'adminModule'
	,'ui.router'
	,'ngResource'
	])

.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/module/main/main.html',
			controller: 'mainCtrl',
			access: { restricted: false }
		})

		.state('admin', {
			url: '/admin',
			views: {
				'': {
					templateUrl: 'module/admin/admin.html'
				},
				'skill@admin': {
					templateUrl: 'module/admin/admin-skills.html'
				},
				'message@admin': {
					templateUrl: 'module/admin/admin-messages.html',
					controller: 'adminMessageCtrl'
				}
			},
			access: { restricted: true }
		})

		.state('login', {
			url: '/login',
			templateUrl: 'module/admin/login.html',
			access: { restricted: false }
		});
})

.run(function($rootScope, $state, authService) {
	$rootScope.$on('$stateChangeStart', function(event, next, current){
		authService.getUserStatus()
		if(next.access.restricted && !authService.isLoggedIn()){
			$state.transitionTo("login");
      		event.preventDefault(); 
	     }
		$('.test').remove();
	});
});