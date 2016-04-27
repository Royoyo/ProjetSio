webApp.factory("serviceRoles",
	function(Restangular){
		return {
			getRoles: function(){
				return Restangular.all("roles").getList();
			},
		}
	})