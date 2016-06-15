angular.module('uyApp')

.factory('authService', function($q, $timeout, $http){
	var user = null;

	return ({
		login: login,
		logout: logout,
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus
	});

    function getUserStatus() {
      $http.get('auth/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    };

	function isLoggedIn(){
	    if(user) {
	        return true;
	      } else {
	        return false;
	      }
    };

	function login(userAccount){
		var deferred = $q.defer();
		$http.post('auth/login', userAccount)
		.then(function(response){
			if (response.data.state == 'success'){
				user = true;
				deferred.resolve(response);
			} else {
				user = false;
				deferred.reject(response);
			}
		});
		return deferred.promise;
	};

    function logout(){
    	var deferred = $q.defer();
    	$http.get('auth/signout')
    	.then(function(){
    		deferred.resolve();
    	});
    	return deferred.promise;
    }
});