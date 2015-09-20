//Les services permettent de créer des sections de codes accessible par tous les controllers


// Ce service crée la liste des utilisateurs  manipulable pour la vue admin
// Bien sûr toutes les fonctions pour la connection avec la BDD ne sont pas encore en place dans cet exemple
// et le système sera bien différent une fois l'api backend mise en place
// TO DO : remplacer les infos de la maquette et mettre une connexion avec l'API backend
webApp.service('adminList',
	function($filter,$http){
		//Pour la maquette, je crée une liste de données fictives :
		var personnes;
		
		$http.get('http://192.168.0.3/SIO/PPEBackend/admin/personnes')
			.then(function(response){
				personnes = response.data;
			});
			
		
		//Toute la logique objet que j'indique ici sera côté serveur à terme
		
		//Une fonction pour ajouter un user à la liste
		var addPersonne = function(newObj) {
			personnes.push(newObj);
		}
		
		//Une fonction pour récupérer la liste entière
		var getPersonnes = function(){
		return $http.get('http://192.168.0.3/SIO/PPEBackend/admin/personnes')
			.then(function(response){
				personnes = response.data;
			});
		}
		
		//Une fonction pour récupérer un user en particulier
		var getPersonne = function(id) {
			return $filter('filter')(personnes, {id : id})[0];
		}
		
		
		return {
			//De base, les fonctions déclarées dans un service sont privées, pour les rendre publiques il faut les indiquer comme cela :
			addPersonne : addPersonne,
			getPersonnes : getPersonnes,
			getPersonne : getPersonne
		}
	})