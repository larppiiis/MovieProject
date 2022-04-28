-- --------------------------------------------------------
-- Verkkotietokone:              127.0.0.1
-- Palvelinversio:               10.7.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Versio:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for moviedb
CREATE DATABASE IF NOT EXISTS `moviedb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `moviedb`;

-- Dumping structure for taulu moviedb.movie
CREATE TABLE IF NOT EXISTS `movie` (
  `Movie_id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) CHARACTER SET utf8mb3 DEFAULT NULL,
  `Genre` varchar(20) CHARACTER SET utf8mb3 DEFAULT NULL,
  `Duration` decimal(20,6) DEFAULT NULL,
  `Description` varchar(300) CHARACTER SET utf8mb3 DEFAULT NULL,
  `Release_date` date DEFAULT NULL,
  `is_watched` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping structure for taulu moviedb.view
CREATE TABLE IF NOT EXISTS `view` (
  `View_id` int(11) NOT NULL AUTO_INCREMENT,
  `Place` varchar(20) CHARACTER SET utf8mb3 DEFAULT NULL COMMENT 'Place = for example: Netflix, Finnkino, Viaplay, TV',
  `Date` date DEFAULT NULL COMMENT 'The date when the movie was watched',
  `Movie_id` int(11) NOT NULL,
  PRIMARY KEY (`View_id`),
  KEY `fk_View_Movie1` (`Movie_id`),
  CONSTRAINT `fk_View_Movie1` FOREIGN KEY (`Movie_id`) REFERENCES `movie` (`Movie_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- Dumping structure for taulu moviedb.rating
CREATE TABLE IF NOT EXISTS `rating` (
  `Rating_id` int(11) NOT NULL AUTO_INCREMENT,
  `Rating` tinyint(3) unsigned DEFAULT NULL,
  `Comments` varchar(100) CHARACTER SET utf8mb3 DEFAULT NULL,
  `View_id` int(11) NOT NULL,
  PRIMARY KEY (`Rating_id`),
  KEY `fk_Rating_View1` (`View_id`),
  CONSTRAINT `fk_Rating_View1` FOREIGN KEY (`View_id`) REFERENCES `view` (`View_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
