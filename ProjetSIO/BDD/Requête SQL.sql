CREATE TABLE  `login` (

	/* un id unique par ligne ; unsigned -> pas de nombre négatif; NOT NULL -> pas de null possible;
		auto_increment -> s'incrémente automatiquement de 1 */
  loginId int(10) unsigned NOT NULL auto_increment,
 
	/*Nom d'utilisateur, mot de passe et email du compte; varchar -> string/char* avec (x) comme max */
  name varchar(30) NOT NULL,
  password varchar(50) NOT NULL,
  email varchar(255) NOT NULL,
  
  /* role -> va nous permettre de donner les différents niveaux d'accès aux utilisateurs ( admin, user,...etc) */
  roleCode varchar(45) NOT NULL,
  
  /* Permet d'activer ou de désactiver un compte utilisateur */
  disabled tinyint(1) NOT NULL default '0',
  
  /* On va utiliser ce champ pour vérifier si un utilisateur est déjà connecté*/
  activated tinyint(1) NOT NULL default '0',
  
  /*indique la clé primaire */
  PRIMARY KEY  (`loginid`)
);