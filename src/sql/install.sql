-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Lun 18 Avril 2016 à 16:13
-- Version du serveur :  5.6.25-log
-- Version de PHP :  5.6.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `test`
--

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `nom` varchar(25) NOT NULL,
  `id_Users` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

CREATE TABLE IF NOT EXISTS `cours` (
  `id` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `id_Matieres` int(11) NOT NULL,
  `id_Users` int(11) DEFAULT NULL,
  `assignationSent` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Structure de la table `indisponibilites`
--

CREATE TABLE IF NOT EXISTS `indisponibilites` (
  `id` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `id_Users` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE IF NOT EXISTS `matieres` (
  `id` int(11) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `code` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(25) DEFAULT NULL,
  `home` varchar(30) NOT NULL,
  `priority` int(5) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `roles`
--

INSERT INTO `roles` (`id`, `role`, `home`, `priority`) VALUES
(1, 'administrateur', 'administration', 1),
(2, 'planificateur', 'planification', 25),
(3, 'enseignant', 'enseignement', 50);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password` varchar(64) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `connected` tinyint(1) NOT NULL,
  `hash` varchar(128) NOT NULL,
  `token` varchar(50) DEFAULT NULL,
  `tokenCDate` datetime DEFAULT NULL,
  `theme` varchar(256) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `firstName`, `lastName`, `email`, `enabled`, `connected`, `hash`, `token`, `tokenCDate`, `theme`) VALUES
(1, 'dmosin', '79dab24f39387b54b8bf23eaae0f929eeb1ebe82', 'Didier', 'Mosin', 'didier@ifide.net', 1, 1, '236155714eb110f2ff5.50325128', 'test', NULL, '');

-- --------------------------------------------------------

--
-- Structure de la table `users_matieres`
--

CREATE TABLE IF NOT EXISTS `users_matieres` (
  `id_Users` int(11) NOT NULL,
  `id_Matieres` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 1),
(2, 1),
(3, 1);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Cours_id_Matieres` (`id_Matieres`),
  ADD KEY `FK_Cours_id_Users` (`id_Users`);

--
-- Index pour la table `cours_classes`
--
ALTER TABLE `cours_classes`
  ADD PRIMARY KEY (`id_Cours`,`id_Classes`),
  ADD KEY `FK_Cours_Classes_id_Classes` (`id_Classes`);

--
-- Index pour la table `indisponibilites`
--
ALTER TABLE `indisponibilites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Indisponibilites_id_Users` (`id_Users`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `priority` (`priority`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users_matieres`
--
ALTER TABLE `users_matieres`
  ADD PRIMARY KEY (`id_Users`,`id_Matieres`),
  ADD KEY `FK_Users_Matieres_id_Matieres` (`id_Matieres`);

--
-- Index pour la table `users_roles`
--
ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`id_Roles`,`id_Users`),
  ADD KEY `FK_Users_Roles_id_Users` (`id_Users`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `cours`
--
ALTER TABLE `cours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `indisponibilites`
--
ALTER TABLE `indisponibilites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
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
