Create table `roles` (
	
	roleId int unsigned not null,
	name varchar(50) not null
	
	PRIMARY KEY (`roleId`)
)

INSERT INTO TABLE `roles` values
(1,"administrateur"),
(2,"planificateur"),
(3,"enseignant");
	