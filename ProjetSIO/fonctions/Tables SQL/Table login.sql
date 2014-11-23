CREATE TABLE  `login` (

	/* un id unique par ligne ; unsigned -> pas de nombre négatif; NOT NULL -> pas de null possible;
		auto_increment -> s'incrémente automatiquement de 1 */
  loginId int(10) unsigned NOT NULL auto_increment,
 
	/*Nom d'utilisateur, mot de passe et email du compte; varchar -> string/char* avec (x) comme max 
	 Je rajoute deux champs, "firstName" et "lastName" pour avoir une meilleure vision de qui est l'utilisateur*/
  login varchar(30) NOT NULL,
  firstName varchar(30) NOT NULL,
  lastName varchar(30) NOT NULL,
  password varchar(50) NULL,
  email varchar(255) NOT NULL,
  
  /* Permet d'activer ou de désactiver un compte utilisateur */
  enabled boolean NOT NULL,
  
  /* le token qui sera utilisé pour envoyé un lien d'activation unique à l'utilisateur */
  token varchar(50) NULL,
  /* une date sur laquelle on va se baser le temps de validité du lien d'activation*/
  tokenCDate datetime NULL,
  
  /*indique la clé primaire */
  PRIMARY KEY  (`loginId`)
);