/**
 * A controller for registering event handlers and initialting validation
 *
 **/
(function(){
	angular.module('tangoValidation').controller('ValidationController',['ValidationRule',function(ValidationRule){
		var self = this;

		var validateForm = function(scope, ele, attr){
			
			
			var eleRef = angular.element(ele);

			// Different types of validations
			var applyValidation = attr.rel.split(';');

			var run = function(){
				// First validation rule to apply
				var applyRule = applyValidation[0];

				// If first validation rule is required and value is blank skip other validation rules
				if(!self.modelValue && (applyRule.indexOf('required') != -1) ){
					var validationConfig 	= applyRule.split(':'),
						validationType 		= validationConfig[0],
						errorCode 			= validationConfig[1];
					ValidationRule.showError({
						eleRef:eleRef,
						validation:{
							type:validationType,
							errorCode:errorCode,
							success:attr.success
						}
						
					})
					
					return;
				}else if(!!attr.success && self.modelValue  && (applyRule.indexOf('required') != -1) && !applyValidation[1]){
					// if only required validation rule is applied and value is not blank
					ValidationRule.addSuccess({
						eleRef:eleRef,
						validation:{
							success:attr.success
						}						
					})
				}else if(self.modelValue){
					// if multiple validation rules are applied along with required run next rule after satisfing required rule
					var applyRule = applyValidation[1] ? applyValidation[1] : applyValidation[0];
					var validationConfig 	= applyRule.split(':'),
						validationType 		= validationConfig[0],
						errorCode 			= validationConfig[1];
					ValidationRule.runValidation({
						validation:{
							type:validationType,
							errorCode:errorCode,
							success:attr.success
						},
						val:self.modelValue,
						matchVal:self.argValue,
						eleRef:eleRef
					})
				}
			}

			// register event handlers
			eleRef.bind('keyup',function(){
				run()
			})

			// event handler for select box
			eleRef.bind('change',function(){
				run()
			})
		}

		self.init = function(scope, ele, attr){
			validateForm(scope, ele, attr)
		}


	}])
})();