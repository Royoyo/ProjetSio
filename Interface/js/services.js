//Les services permettent de créer des sections de codes accessible par tous les controllers


// Ce service crée la liste des utilisateurs  manipulable pour la vue admin
// Bien sûr toutes les fonctions pour la connection avec la BDD ne sont pas encore en place dans cet exemple
// et le système sera bien différent une fois l'api backend mise en place
// TO DO : remplacer les infos de la maquette et mettre une connexion avec l'API backend
webApp.service('adminList',
	function($filter, Restangular){

		var personnes = Restangular.all('admin/personnes');
		
			
		
		//Toute la logique objet que j'indique ici sera côté serveur à terme
		
		//Une fonction pour ajouter un user à la liste
		var addPersonne = function(newObj) {
			personnes.push(newObj);
		}
		
		//Une fonction pour récupérer la liste entière
		var getPersonnes = function(){
			return personnes;
		}
		
		//Une fonction pour récupérer un user en particulier
		var getPersonne = function(id) {
			return personnes.get(id);
		}
		
		
		return {
			//De base, les fonctions déclarées dans un service sont privées, pour les rendre publiques il faut les indiquer comme cela :
			addPersonne : addPersonne,
			getPersonnes : getPersonnes,
			getPersonne : getPersonne
		}
	})