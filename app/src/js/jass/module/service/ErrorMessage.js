/**
 * Error/Success Message service
 *
 **/
(function(){

	angular.module('tangoValidation').service('ErrorConfig',[function(){
		var self = this;

		self.message = {
			'1000':'Required filed',
			'1001':'Invalid Email Id',
			'1002':'Password do not match',
			'1003':'Username already registered <a href="#/login">login</a>'
		}

		self.successMsg = {
			'1000': 'Available',
			'1001': 'Password match',
			'1002': 'Looks great'
		}
	}]);

})();