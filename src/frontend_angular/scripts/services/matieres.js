webApp.factory("serviceMatieres",
	function(Restangular){
		return {
			getMatieres: function(){
				return Restangular.all("matieres").getList();
			},
		}
	})