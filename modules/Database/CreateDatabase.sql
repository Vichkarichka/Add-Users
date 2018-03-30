CREATE DATABASE `Users`;
USE Users;
CREATE TABLE `Human` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameuser` varchar(45) NOT NULL,
  `surnameuser` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `age` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
CREATE TABLE `LoginUsershash` (
  `Userid` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `timestamp` bigint(8) NOT NULL,
  PRIMARY KEY (`Userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


