//Les services permettent de créer des sections de codes accessible par tous les controllers


// Ce service crée la liste des utilisateurs  manipulable pour la vue admin
// Bien sûr toutes les fonctions pour la connection avec la BDD ne sont pas encore en place dans cet exemple
// et le système sera bien différent une fois l'api backend mise en place
// TO DO : remplacer les infos de la maquette et mettre une connexion avec l'API backend
webApp.service('adminService',
	function(Restangular){

		var personnes = Restangular.all('/admin/personnes');

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
			getPersonnes : getPersonnes,
			getPersonne : getPersonne
		}
	})
	
webApp.service('planService',
	function(Restangular){

		var personnes = Restangular.all('admin/personnes');
		
			
		
		//Toute la logique objet que j'indique ici sera côté serveur à terme
		
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
			getPersonnes : getPersonnes,
			getPersonne : getPersonne
		}
	})
	
webApp.service('matiereService',
	function(Restangular){

		var matieres = Restangular.all('matieres');		
		
		//Une fonction pour récupérer la liste entière
		var getMatieres = function(){
			return matieres;
		}
		
		return {
			//De base, les fonctions déclarées dans un service sont privées, pour les rendre publiques il faut les indiquer comme cela :
			getMatieres : getMatieres
		}
	})

//Session utilisateur Javascript ( garder au chaud dans la session du navigateur par la factory Authentification)
webApp.service('Session', function($rootScope, USERS_ROLES) {

	this.create = function(user) {
		this.user = user.name;
		this.role = user.role;
		this.token = user.token;
		this.home = user.home;
		this.id = user.id;
	};
	this.destroy = function() {
		this.user = null;
		this.role = null;
		this.token = null;
		this.home = null;
		this.id = null;
	};
	return this;
});