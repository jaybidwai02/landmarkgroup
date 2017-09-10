(function(){

	app.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.when('', '/');
		
		$urlRouterProvider.otherwise(function($injector) {
		    var $state = $injector.get('$state');
		    $state.go('login', null, {
		        location: false
		    });
		}); 

		$stateProvider.state({
			name:'login',
			url:'/',
			templateUrl:'src/view/login.html'
		});

		$stateProvider.state({
			name:'registration',
			url:'/registration',
			templateUrl:'src/view/registration.html'
		})

	})

})();