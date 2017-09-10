/**
 * A Validation directive 
 * apply this directive on each field you want to apply validation
 * with validation rules as well as error code specified in rel attr ex: rel="required:1000"
 **/
(function(){

	angular.module('tangoValidation').directive('validate',[function(){
		return{
			restrict:'A',
			scope:{},
			bindToController:{
				modelValue: "=ngModel",
				argValue: '=match'
			},
			controller:'ValidationController',
			controllerAs:'validation',
			require:'validate',
			link:function(scope, ele, attr, ctrl){
				ctrl.init(scope, ele, attr);
			}
		}
	}])

})();