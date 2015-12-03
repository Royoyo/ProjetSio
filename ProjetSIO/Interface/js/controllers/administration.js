//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminPersonnes, $modal, Restangular) {
		
		$scope.personnes = [];
		adminPersonnes.getPersonnes().then(function(personnes){		
			angular.forEach(personnes,function(element){
				if (element.enabled == 1){
					element.enabled = true;
				}
				else{
					element.enabled = false;
				}
			})
			Restangular.copy(personnes,$scope.personnes);
			$scope.personnesView = [].concat($scope.personnes);
		});
		
		$scope.openDetails = function(personne) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.personne = personne;
			
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"modals/administration.details.html",
				controller: "AdminDetails",
				size: "md",
				resolve: {
					personne: function(){
						return $scope.personne;
					}
				}
			});
			
			modalDetails.result.then(function(creation){
				if (creation === 1){
					adminPersonnes.getPersonnes().then(function(personnes){
						Restangular.copy(personnes,$scope.personnes);
						$scope.personnesView = [].concat($scope.personnes);
					});
				}
			});
		};
		
		$scope.remove = function(personne){
			personne.remove().then(function(){
				var index = $scope.personnes.indexOf(personne);
      			if (index > -1)
				  $scope.personnes.splice(index, 1);
			})
		}
	});


//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller('AdminDetails',
	function($scope, adminPersonnes, Restangular, personne, $modalInstance){	
		
		$scope.personne = personne;
		$scope.creation = false;
			
		if (personne === -1)
		{
			$scope.creation = true;
			$scope.personne = {};
		}
		else
		{
			adminPersonnes.getPersonne(personne.id).then(function(personne){
				Restangular.copy(personne,$scope.personne);
			});
		}
			
		$scope.save = function (personne) {
			if ($scope.creation === true)
			{
				adminPersonnes.postPersonne(personne)
				$modalInstance.close(1)
			}			
			else
			{
				personne.save();
				$modalInstance.close(0)
			}			
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};
		
	});