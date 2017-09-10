(function(){
	app.controller('RegistrationController', ['$scope','SubmitService', function($scope, SubmitService){
	
		$scope.onSubmit = SubmitService.onSubmit.bind($scope, {formName: 'regForm', id:'regForm'});	

		$scope.data = {};

		$scope.sexDD = [{name:'Male',id:1},{name:'Female',id:2}];
	}])
})();