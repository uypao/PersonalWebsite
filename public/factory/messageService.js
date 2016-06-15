angular.module('uyApp')

.factory('messageService', function($resource){
	return $resource('api/messages');
});