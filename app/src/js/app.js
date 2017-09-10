/**
 * A seprate validation module for application
 *
 **/

(function(){

	angular.module('tangoValidation',[]);

})();
var app = angular.module('app', ['tangoValidation','ui.router']);

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


(function(){

	app.controller('LoginController',['$scope', 'SubmitService',function($scope, SubmitService){
		$scope.data = {};

		$scope.onSubmit =  SubmitService.onSubmit.bind($scope, {formName: 'loginForm', id:'loginForm'});

	}])

})();
(function(){
	app.controller('RegistrationController', ['$scope','SubmitService', function($scope, SubmitService){
	
		$scope.onSubmit = SubmitService.onSubmit.bind($scope, {formName: 'regForm', id:'regForm'});	

		$scope.data = {};

		$scope.sexDD = [{name:'Male',id:1},{name:'Female',id:2}];
	}])
})();
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
/**
 * diffrent validation rules like email, required, userName, match
 *
 **/
(function(){

	angular.module('tangoValidation').service('ValidationRule',['ErrorConfig','$http',function(ErrorConfig, $http){
		var self = this;	


		self.showError = function(config){
			var errMsg = ErrorConfig.message[config.validation.errorCode];
			config.eleRef.parent().removeClass('success').addClass('error');
			config.eleRef.parent().find('span').html(errMsg);

		}

		var removeError = function(config){
			config.eleRef.parent().removeClass('error');
			config.eleRef.parent().find('span').html('');
			return self;
		}

		self.addSuccess = function(config){
			if(!config.validation.success) return;
			var successMsg = ErrorConfig.successMsg[config.validation.success];
			config.eleRef.parent().addClass('success').removeClass('error');
			config.eleRef.parent().find('span').html(successMsg);
		}

		var validateEmail = function(config){
			// console.log(config.val)
			var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			 if(!emailPattern.test(config.val)){
			 	self.showError(config)
			 }else{
			 	removeError(config).addSuccess(config)
			 }
		}

		var matchPassword = function(config){
			
			 if(config.val != config.matchVal){
			 	self.showError(config)
			 }else{
			 	removeError(config).addSuccess(config)
			 }
		}

		var userNameChk = function(config){
			try{
				$http.get('userName.json').then(function(res){
					if(res.data.indexOf(config.val) == -1){
						self.addSuccess(config)
					}else{
						self.showError(config)
					}
				},function(){
					console.log('For Username availability check please "Run application on localhost"')
				});
			}
			catch(err){
				console.log(err)
			}
		}

		self.runValidation = function(config){
			switch(config.validation.type){
				case 'email':
					validateEmail(config);
					break;
				case 'match':
					matchPassword(config);
					break;
				case 'userName':
					userNameChk(config);
					break;
				default:
					removeError(config)
					break;
			}
		}

		
	}])

})();
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
/**
 * Submit service called on submiting each form
 * this service can be use to post data to backend
 **/
(function(){

	app.service('SubmitService', [function(){
		var self = this;

		self.onSubmit = function(config, evt){
			evt.preventDefault();

			var formRef = angular.element(document.getElementsByName(config.formName));
			var allInputs = formRef.find('input');

			for(var i = 0; i < allInputs.length; i++){
				angular.element(allInputs[i]).triggerHandler('keyup');
			}

			this.formNode = angular.element(document.querySelectorAll('#' + config.id + ' .error'));
			if(!this.formNode.length){
				console.log("Form submited successfully with below values:")
				console.log(this.data)
			}
		}

	}])

})();
angular.module('app').run(['$templateCache',function($templateCache){  'use strict';

  $templateCache.put('src/view/login.html',
    "<div class=\"secHeader\"><h1>State thy name and ye shall pass</h1><p>Not a member yet? <a ui-sref=\"registration\">Register</a> now — it's fun and easy!</p></div><div class=\"loginReg clear\"><div class=\"userForm fl\"><div class=\"loginForm\" ng-controller=\"LoginController\"><form name=\"loginForm\" id=\"loginForm\"><div class=\"formControl\"><input type=\"text\" class=\"inputControl\" name=\"userName\" ng-model=\"data.userName\" placeholder=\"Username\" validate rel=\"required:1000\"> <span class=\"errLbl\"></span></div><div class=\"formControl\"><input type=\"password\" class=\"inputControl\" name=\"userPwd\" ng-model=\"data.userPwd\" placeholder=\"Password\" validate rel=\"required:1000\"> <span class=\"errLbl\"></span></div><div class=\"btn clear\"><div class=\"remember fl\"><input type=\"checkbox\" name=\"remember\" id=\"remember\"><label for=\"remember\">Remember me</label></div><input type=\"submit\" name=\"reg\" value=\"Login\" class=\"fr\" ng-click=\"onSubmit($event)\" ng-class=\"{'btn-dis':(!data.userName || !data.userPwd),'btn-active':(data.userName && data.userPwd)}\"></div></form></div></div><div class=\"verticalSep fl\"><span>or</span></div><div class=\"social fl\"><div class=\"fb\"><a href=\"javascript:void(0);\">Login with Facebook</a></div><div class=\"twt\"><a href=\"javascript:void(0);\">Login with Twitter</a></div></div></div>"
  );


  $templateCache.put('src/view/registration.html',
    "<div class=\"secHeader\"><h1>Join Tango today.</h1><p>It's free and always will be.</p></div><div class=\"loginReg clear\"><div class=\"userForm fl\"><div class=\"regForm\" ng-controller=\"RegistrationController\"><form name=\"regForm\" id=\"regForm\"><div class=\"formControl\"><input type=\"text\" class=\"inputControl\" name=\"userEmail\" ng-model=\"data.email\" placeholder=\"Email Address\" validate rel=\"required:1000;email:1001\" data-success=\"1002\"> <span class=\"errLbl\"></span></div><div class=\"formControl\"><input type=\"text\" class=\"inputControl\" name=\"userName\" ng-model=\"data.userName\" placeholder=\"Username\" validate rel=\"required:1000;userName:1003\" data-success=\"1000\"> <span class=\"errLbl\"></span></div><div class=\"formControl\"><input type=\"password\" class=\"inputControl\" name=\"userPwd\" ng-model=\"data.userPwd\" placeholder=\"Password\" validate rel=\"required:1000\" data-success=\"1002\"> <span class=\"errLbl\"></span></div><div class=\"formControl\"><input type=\"password\" class=\"inputControl\" name=\"userPwdMatch\" ng-model=\"data.userPwdMatch\" placeholder=\"Confirm Password\" validate rel=\"required:1000;match:1002\" data-success=\"1001\" data-match=\"data.userPwd\"> <span class=\"errLbl\"></span></div><div class=\"formControl\" ng-class=\"{success:data.sex}\"><select ng-model=\"data.sex\" validate rel=\"required:1000\" data-success=\"\"><option value=\"\" disabled=\"disabled\" selected=\"selected\" hidden>Sex</option><option ng-repeat=\"val in sexDD\" value=\"{{val.id}}\">{{val.name}}</option></select><input type=\"hidden\" name=\"sex\" ng-model=\"data.sex\" validate rel=\"required:1000\"> <span class=\"errLbl\"></span></div><p class=\"termAndCon\">By clicking Register, you agree to our <a href=\"javascript:void(0);\">Terms</a> and that you have read our <a href=\"javascript:void(0);\">Data Use Policy</a>, including our <a href=\"javascript:void(0);\">Cookie Use</a>.</p><div class=\"btn submit\"><input type=\"submit\" name=\"reg\" value=\"Register\" class=\"fr\" ng-click=\"onSubmit($event)\" ng-class=\"{'btn-dis':(!data.email || !data.userName || !data.userPwd || !data.userPwdMatch ||  !data.sex),'btn-active':(data.email && data.userName && data.userPwd && data.userPwdMatch &&  data.sex)}\"></div></form></div></div><div class=\"verticalSep fl\"><span>or</span></div><div class=\"social fl\"><div class=\"fb\"><a href=\"javascript:void(0);\">Register with Facebook</a></div><div class=\"twt\"><a href=\"javascript:void(0);\">Register with Twitter</a></div></div></div>"
  );


  $templateCache.put('src/view/view.html',
    "<p>iiiiiiiiii</p>"
  );
}]);