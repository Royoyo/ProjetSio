-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Ven 25 Septembre 2015 à 16:14
-- Version du serveur :  5.6.20
-- Version de PHP :  5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `ppe`
--

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
`id` int(11) NOT NULL,
  `dateDebut` date NOT NULL,
  `dateFin` date NOT NULL,
  `nom` varchar(25) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `classes`
--

INSERT INTO `classes` (`id`, `dateDebut`, `dateFin`, `nom`) VALUES
(1, '2015-09-06', '2016-05-28', 'SIO2');

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

CREATE TABLE IF NOT EXISTS `cours` (
`id` int(11) NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `id_Matieres` int(11) NOT NULL,
  `id_Users` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `cours`
--

INSERT INTO `cours` (`id`, `dateDebut`, `dateFin`, `id_Matieres`, `id_Users`) VALUES
(1, '2015-09-24 08:00:00', '2015-09-24 19:00:00', 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `cours_classes`
--

CREATE TABLE IF NOT EXISTS `cours_classes` (
  `id_Cours` int(11) NOT NULL,
  `id_Classes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `fermetures`
--

CREATE TABLE IF NOT EXISTS `fermetures` (
`id` int(11) NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `fermetures`
--

INSERT INTO `fermetures` (`id`, `dateDebut`, `dateFin`) VALUES
(1, '2015-10-01 23:00:00', '2015-10-14 09:18:15');

-- --------------------------------------------------------

--
-- Structure de la table `indisponibilites`
--

CREATE TABLE IF NOT EXISTS `indisponibilites` (
`id` int(11) NOT NULL,
  `dateDebut` datetime NOT NULL,
  `dateFin` datetime NOT NULL,
  `id_Users` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `indisponibilites`
--

INSERT INTO `indisponibilites` (`id`, `dateDebut`, `dateFin`, `id_Users`) VALUES
(1, '2015-09-26 23:59:59', '2015-09-28 00:00:30', 2);

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE IF NOT EXISTS `matieres` (
`id` int(11) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `code` varchar(25) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `code`) VALUES
(1, 'prog', 'pr');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
`id` int(11) NOT NULL,
  `role` varchar(25) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Contenu de la table `roles`
--

INSERT INTO `roles` (`id`, `role`) VALUES
(1, 'administrateur'),
(2, 'planificateur'),
(3, 'enseignant');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `token` varchar(50) DEFAULT NULL,
  `tokenCDate` datetime DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `login`, `firstName`, `lastName`, `email`, `enable`, `token`, `tokenCDate`) VALUES
(1, 'testbiscuit', 'premier', 'test', 'test@biscuit.fr', 1, NULL, NULL),
(2, 'jardinbus', 'jardin', 'raisin', 'raisin@biscuit.fr', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users_matieres`
--

CREATE TABLE IF NOT EXISTS `users_matieres` (
  `id_Users` int(11) NOT NULL,
  `id_Matieres` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users_matieres`
--

INSERT INTO `users_matieres` (`id_Users`, `id_Matieres`) VALUES
(1, 1),
(2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users_roles`
--

CREATE TABLE IF NOT EXISTS `users_roles` (
  `id_Roles` int(11) NOT NULL,
  `id_Users` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users_roles`
--

INSERT INTO `users_roles` (`id_Roles`, `id_Users`) VALUES
(2, 1),
(1, 2);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `classes`
--
ALTER TABLE `classes`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `cours`
--
ALTER TABLE `cours`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_Cours_id_Matieres` (`id_Matieres`), ADD KEY `FK_Cours_id_Users` (`id_Users`);

--
-- Index pour la table `cours_classes`
--
ALTER TABLE `cours_classes`
 ADD PRIMARY KEY (`id_Cours`,`id_Classes`), ADD KEY `FK_Cours_Classes_id_Classes` (`id_Classes`);

--
-- Index pour la table `fermetures`
--
ALTER TABLE `fermetures`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `indisponibilites`
--
ALTER TABLE `indisponibilites`
 ADD PRIMARY KEY (`id`), ADD KEY `FK_Indisponibilites_id_Users` (`id_Users`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users_matieres`
--
ALTER TABLE `users_matieres`
 ADD PRIMARY KEY (`id_Users`,`id_Matieres`), ADD KEY `FK_Users_Matieres_id_Matieres` (`id_Matieres`);

--
-- Index pour la table `users_roles`
--
ALTER TABLE `users_roles`
 ADD PRIMARY KEY (`id_Roles`,`id_Users`), ADD KEY `FK_Users_Roles_id_Users` (`id_Users`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `classes`
--
ALTER TABLE `classes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `cours`
--
ALTER TABLE `cours`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `fermetures`
--
ALTER TABLE `fermetures`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `indisponibilites`
--
ALTER TABLE `indisponibilites`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `cours`
--
ALTER TABLE `cours`
ADD CONSTRAINT `FK_Cours_id_Matieres` FOREIGN KEY (`id_Matieres`) REFERENCES `matieres` (`id`),
ADD CONSTRAINT `FK_Cours_id_Users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `cours_classes`
--
ALTER TABLE `cours_classes`
ADD CONSTRAINT `FK_Cours_Classes_id` FOREIGN KEY (`id_Cours`) REFERENCES `cours` (`id`),
ADD CONSTRAINT `FK_Cours_Classes_id_Classes` FOREIGN KEY (`id_Classes`) REFERENCES `classes` (`id`);

--
-- Contraintes pour la table `indisponibilites`
--
ALTER TABLE `indisponibilites`
ADD CONSTRAINT `FK_Indisponibilites_id_Users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users_matieres`
--
ALTER TABLE `users_matieres`
ADD CONSTRAINT `FK_Users_Matieres_id_Matieres` FOREIGN KEY (`id_Matieres`) REFERENCES `matieres` (`id`),
ADD CONSTRAINT `FK_Users_Matieres_id_Users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users_roles`
--
ALTER TABLE `users_roles`
ADD CONSTRAINT `FK_Users_Roles_id_Roles` FOREIGN KEY (`id_Roles`) REFERENCES `roles` (`id`),
ADD CONSTRAINT `FK_Users_Roles_id_Users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
