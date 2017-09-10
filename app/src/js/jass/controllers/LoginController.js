(function(){

	app.controller('LoginController',['$scope', 'SubmitService',function($scope, SubmitService){
		$scope.data = {};

		$scope.onSubmit =  SubmitService.onSubmit.bind($scope, {formName: 'loginForm', id:'loginForm'});

	}])

})();