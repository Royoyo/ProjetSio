CREATE TABLE  `login` (

	/* un id unique par ligne ; unsigned -> pas de nombre négatif; NOT NULL -> pas de null possible;
		auto_increment -> s'incrémente automatiquement de 1 */
  loginId int unsigned NOT NULL auto_increment,
 
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
  /* une date sur laquelle on va se baser pour le temps de validité du lien d'activation*/
  tokenCDate datetime NULL,
  
  /*indique la clé primaire */
  PRIMARY KEY  (`loginId`)
);

/*Création d'une table pour les rôles*/
Create table `roles` (
	
	roleId int unsigned not null,
	name varchar(50) not null,
	
	PRIMARY KEY (`roleId`)
);

/* La création d'une table intermédiaire qui permet d'affecter plus d'un rôle à un utilisateur*/ 
Create table `user_roles` ( 
	roleId int unsigned not null,
	loginId int unsigned not null,
	
	PRIMARY KEY (roleId, loginId),
	
	/* Les lignes suivantes permettent d'établir une connexion entre les tables */
	FOREIGN KEY (loginId) 
	REFERENCES `login`(loginId),
	
	FOREIGN KEY (roleId) 
	REFERENCES `roles`(roleId) 
);


/* Insertion des rôles demandés par le cahier des charges */
INSERT INTO `roles` values
(1,"administrateur"),
(2,"planificateur"),
(3,"enseignant");
	