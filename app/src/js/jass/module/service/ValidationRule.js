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