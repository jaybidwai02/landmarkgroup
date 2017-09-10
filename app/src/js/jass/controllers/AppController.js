(function(){

	app.controller('AppController',['$scope',function($scope){

		$scope.showLightBox = false;
		
		// Open light box and set flag to disable body scroll
		$scope.openLightBox = function(){
			var appVideo = angular.element(document.getElementById('appVideo'));
			var src = appVideo.attr('cust-src');
			$scope.showLightBox = !$scope.showLightBox;
			if($scope.showLightBox){
				appVideo.attr('src', src);
			}else{

				appVideo.attr('src', '');
			}
		}
		
	}])

})();

