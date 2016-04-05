webApp.factory("serviceActivation",
	function(Restangular){
		return {
			Activation: function(id,token){
				return Restangular.one("activation",id).one("token",token).get();
			},
            SetFirstPassword: function(user){
				return Restangular.all("set_firstpassword").post(user);
			},
		}
	})