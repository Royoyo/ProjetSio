webApp.factory("planClasses",
	function(Restangular){
		return {
			getClasses: function(){
				return Restangular.all("plan/classes").getList();
			},
			
			getClasse: function(id){
				return Restangular.one("plan/classes",id).get();
			},
            getNewClasse: function(){
				return Restangular.one("plan/classes");
			},
			postClasse: function(classe){
				Restangular.all("plan/classes").post(classe);
			},
			deleteClasse: function(classe){
				classe.remove();
			}
		}
	})