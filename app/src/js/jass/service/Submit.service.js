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