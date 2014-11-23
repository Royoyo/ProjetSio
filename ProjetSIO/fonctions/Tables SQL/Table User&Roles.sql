/* La création d'une table intermédiaire permet d'affecter plus d'un rôle un utilisateur*/

Create table `user_roles` (

	roleId int unsigned not null,
	userId int unsigned not null,
	
	FOREIGN KEY (`userId`) REFERENCES (`login`),
	FOREIGN KEY (`roleId`) REFERENCES (`roles`)
);