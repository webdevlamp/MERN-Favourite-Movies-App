DB Tables:

CREATE TABLE `favourite-movies`.users (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `password` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `last_login` DATETIME NULL DEFAULT NULL
  PRIMARY KEY (id), 
  UNIQUE KEY email (email)
) ENGINE = InnoDB;

CREATE TABLE `favourite-movies`.`movies` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, 
  `rating` INT NULL DEFAULT NULL, 
  `genre` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, 
  `releasedate` DATETIME NULL DEFAULT NULL, 
  `cast` JSON NULL DEFAULT NULL, 
  `user_id` INT NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;