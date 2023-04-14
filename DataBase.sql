-- --------------------------------------------------------
-- Host:                         
-- Versión del servidor:         8.0.28 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para kaspichessdb
CREATE DATABASE IF NOT EXISTS `kaspichessdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `kaspichessdb`;

-- Volcando estructura para tabla kaspichessdb.gameref
CREATE TABLE IF NOT EXISTS `gameref` (
  `Number` int unsigned NOT NULL,
  `Nodo` int unsigned NOT NULL,
  KEY `Number` (`Number`),
  KEY `Nodo` (`Nodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla kaspichessdb.games
CREATE TABLE IF NOT EXISTS `games` (
  `Number` int unsigned NOT NULL AUTO_INCREMENT,
  `PGNGame` text NOT NULL,
  PRIMARY KEY (`Number`)
) ENGINE=InnoDB AUTO_INCREMENT=1147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla kaspichessdb.tree
CREATE TABLE IF NOT EXISTS `tree` (
  `Nodo` int unsigned NOT NULL AUTO_INCREMENT,
  `NodoPadre` int unsigned NOT NULL DEFAULT '0',
  `FEN` varchar(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Nodo`),
  KEY `FEN` (`FEN`),
  KEY `NodoPadre` (`NodoPadre`)
) ENGINE=InnoDB AUTO_INCREMENT=281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
