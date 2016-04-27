webApp.factory("ensCours",
	function(Restangular){
		return {
			getCours: function(){
				return Restangular.all("ens/cours").getList();
			}         
		}
	})