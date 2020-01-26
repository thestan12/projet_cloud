-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Sam 25 Janvier 2020 à 20:45
-- Version du serveur :  5.7.28-0ubuntu0.18.04.4
-- Version de PHP :  7.2.24-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `cloud`
--

-- --------------------------------------------------------

--
-- Structure de la table `filesuser`
--

CREATE TABLE `filesuser` (
  `id` int(11) NOT NULL,
  `fileName` varchar(500) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `file`
--

INSERT INTO `filesuser` (`id`, `fileName`, `userId`) VALUES
(8, '22815132_880086155480716_8742390530714896771_n.jpg', 1),
(9, 'alias.png', 1),
(10, 'offset.png', 1),
(11, 'instru-azure.txt', 1),
(12, 'mounted and created', 1),
(13, 'android.jpg', 1),
(14, 'android.jpg', 2);

-- --------------------------------------------------------

--
-- Structure de la table `userclient`
--

CREATE TABLE `userclient` (
  `id` int(11) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `userclient`
--

INSERT INTO `userclient` (`id`, `last_name`, `email`, `password`) VALUES
(1, 'moha', 'mohamed@gmail.com', '123456789'),
(2, 'testuser', 'test@gmail.com', '1234567');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `file`
--
ALTER TABLE `filesuser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `userclient`
--
ALTER TABLE `userclient`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `filesuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT pour la table `userclient`
--
ALTER TABLE `userclient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `file`
--
ALTER TABLE `filesuser`
  ADD CONSTRAINT `file_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `userclient` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
