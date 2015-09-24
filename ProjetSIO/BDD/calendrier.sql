-- Base de données :  `planning_scolaire`
--

-- --------------------------------------------------------

--
-- Structure de la table `anneescolaire`
--

CREATE TABLE IF NOT EXISTS `anneescolaire` (
  `Id` int(11) NOT NULL,
  `DateDebut` date DEFAULT NULL,
  `DateFin` date DEFAULT NULL,
  `Nom` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------
--
-- Création de de la table indisponibilites
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `indisponibilites` (
  `Id` int(11) NOT NULL AUTO-INCREMENT,
  `DateDebut` datetime DEFAULT NULL,
  `DateFin` datetime DEFAULT NULL,
  `IdEnseignant` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1

