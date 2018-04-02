CREATE DATABASE `Users`; 
CREATE TABLE `Cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `Countries_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Cities_1_idx` (`Countries_id`),
  CONSTRAINT `Countries_id` FOREIGN KEY (`Countries_id`) REFERENCES `Contries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `Contries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
CREATE TABLE `Human` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameuser` varchar(45) NOT NULL,
  `surnameuser` varchar(45) NOT NULL,
  `role` int(11) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  `age` int(11) NOT NULL,
  `Birth_Date` date NOT NULL,
  `Country` int(11) DEFAULT NULL,
  `City` int(11) DEFAULT NULL,
  `School` int(11) DEFAULT NULL,
  `BIO` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Role_idx` (`role`),
  KEY `Country_idx` (`Country`),
  KEY `City_idx` (`City`),
  KEY `School_idx` (`School`),
  CONSTRAINT `City` FOREIGN KEY (`City`) REFERENCES `Cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Country` FOREIGN KEY (`Country`) REFERENCES `Contries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Role` FOREIGN KEY (`role`) REFERENCES `Roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `School` FOREIGN KEY (`School`) REFERENCES `Schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;
CREATE TABLE `LoginUsershash` (
  `Userid` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `timestamp` bigint(8) NOT NULL,
  PRIMARY KEY (`Userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `Roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
CREATE TABLE `Schools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `School_to_cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `School_id` int(11) DEFAULT NULL,
  `Cities_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Cities_id_idx` (`Cities_id`),
  KEY `School_id_idx` (`School_id`),
  CONSTRAINT `Cities_id` FOREIGN KEY (`Cities_id`) REFERENCES `Cities` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `School_id` FOREIGN KEY (`School_id`) REFERENCES `Schools` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
