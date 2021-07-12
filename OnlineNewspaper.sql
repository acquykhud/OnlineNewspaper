-- MariaDB dump 10.19  Distrib 10.4.18-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: onlinenewspaper
-- ------------------------------------------------------
-- Server version	10.4.18-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article_subcategories`
--

DROP TABLE IF EXISTS `article_subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `article_subcategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL,
  `subcategory_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_article_id` (`article_id`) USING BTREE,
  KEY `fk_article_id_2` (`article_id`),
  KEY `fk_subcategory_id` (`subcategory_id`),
  CONSTRAINT `fk_article_id_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subcategory_id` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_subcategories`
--

LOCK TABLES `article_subcategories` WRITE;
/*!40000 ALTER TABLE `article_subcategories` DISABLE KEYS */;
INSERT INTO `article_subcategories` VALUES (1,1,1),(2,2,2),(3,3,1),(4,4,1),(8,5,2);
/*!40000 ALTER TABLE `article_subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles` (
  `article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int(10) unsigned NOT NULL,
  `title` varchar(512) NOT NULL,
  `state` int(10) unsigned NOT NULL COMMENT '1: Da duyet - cho xuat ban, 2: Da xuat ban, 3: Bi tu choi, 4: Chua duoc duyet',
  `content` varchar(8192) NOT NULL COMMENT 'Luu bai viet ',
  `views` int(10) unsigned NOT NULL DEFAULT 0,
  `is_trending` int(1) NOT NULL DEFAULT 0 COMMENT '1: Co, 0: Khong',
  `is_premium` int(1) NOT NULL DEFAULT 0 COMMENT '1: Co, 0: Khong',
  `published_time` datetime DEFAULT NULL COMMENT 'Thoi gian xuat ban neu state la 2',
  `avatar_path` varchar(512) DEFAULT NULL COMMENT 'anh dai dien',
  `abstract` varchar(4096) DEFAULT NULL COMMENT 'tom tat bai viet',
  `editor_accepted` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `fk_author_id` (`author_id`),
  KEY `fk_state` (`state`),
  KEY `fk_editor_accepted` (`editor_accepted`),
  CONSTRAINT `fk_author_id` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_editor_accepted` FOREIGN KEY (`editor_accepted`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_state` FOREIGN KEY (`state`) REFERENCES `states` (`state_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,3,'Tiêu đề bài báo (Đã duyệt - Chờ xuất bản)',1,'Noi dung (da duoc duyet - cho xuat ban)',100,1,1,'2021-07-05 19:15:28','fake path','Tom tat 1',2),(2,3,'Tiêu đề bài báo (Đã xuất bản)',2,'Noi dung (da xuat ban)',200,1,0,'2021-07-07 19:15:30','fake path 2','Tom tat 2',2),(3,3,'Tiêu đề bài báo (Bị từ chối)',3,'Noi dung (bi tu choi)',300,0,0,'2021-07-14 19:15:32','fake path 3','Tom tat 3',NULL),(4,3,'Tiêu đề bài báo (Chưa được duyệt)',4,'Noi dung (chua duoc duyet)',400,0,1,NULL,'fake path 4','Tom tat 4',NULL),(5,3,'Tiêu đề bài báo ',1,'Noi dung hehe',100,1,0,'2021-07-05 23:13:56','fake path 5','Tom tat 5',2),(6,3,'Tiêu đề bài báo 6',1,'Noi dung nua ne',500,1,0,'2021-07-27 23:14:32','fake path 6','Tom tat 6',2);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles_tags`
--

DROP TABLE IF EXISTS `articles_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles_tags` (
  `article_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_article_id` (`article_id`),
  KEY `fk_tag_id` (`tag_id`),
  CONSTRAINT `fk_article_id` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles_tags`
--

LOCK TABLES `articles_tags` WRITE;
/*!40000 ALTER TABLE `articles_tags` DISABLE KEYS */;
INSERT INTO `articles_tags` VALUES (1,1,1),(1,2,2),(2,1,3),(2,2,4),(3,1,5),(4,2,14),(4,7,15);
/*!40000 ALTER TABLE `articles_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Thể thao'),(2,'Du lịch'),(3,'Kinh doanh'),(4,'Pháp luật'),(5,'Kinh tế'),(6,'Chính trị'),(7,'Xã hội'),(8,'Khoa học'),(9,'Hài'),(10,'Sức khoẻ');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL,
  `time` datetime NOT NULL,
  `subscriber_id` int(10) unsigned NOT NULL,
  `comment_content` varchar(2048) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `fk_article_id_3` (`article_id`),
  KEY `fk_subscriber_id` (`subscriber_id`),
  CONSTRAINT `fk_article_id_3` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subscriber_id` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,'2021-06-26 14:14:50',4,'Noi dung comment tren bai 1'),(2,2,'2021-06-15 14:15:40',4,'Noi dung comment tren bai 2'),(3,3,'2021-07-27 14:16:07',4,'Noi dung comment tren bai 3'),(4,4,'2021-06-16 14:16:22',4,'Noi dung comment tren bai 4');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `declined_articles`
--

DROP TABLE IF EXISTS `declined_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `declined_articles` (
  `declined_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL,
  `editor_id` int(10) unsigned NOT NULL,
  `decline_reason` varchar(4096) NOT NULL,
  `decline_time` datetime DEFAULT NULL,
  PRIMARY KEY (`declined_id`),
  KEY `fk_article_id_4` (`article_id`),
  KEY `fk_editor_id_2` (`editor_id`),
  CONSTRAINT `fk_article_id_4` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_editor_id_2` FOREIGN KEY (`editor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `declined_articles`
--

LOCK TABLES `declined_articles` WRITE;
/*!40000 ALTER TABLE `declined_articles` DISABLE KEYS */;
INSERT INTO `declined_articles` VALUES (1,3,2,'Đây là lí do bị từ chối','2021-06-16 14:18:05'),(2,3,2,'Đây là lí do bị từ chối 2','2021-06-15 14:18:05');
/*!40000 ALTER TABLE `declined_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editor_categories`
--

DROP TABLE IF EXISTS `editor_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `editor_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `editor_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_editor_id` (`editor_id`),
  KEY `fk_category_id` (`category_id`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_editor_id` FOREIGN KEY (`editor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editor_categories`
--

LOCK TABLES `editor_categories` WRITE;
/*!40000 ALTER TABLE `editor_categories` DISABLE KEYS */;
INSERT INTO `editor_categories` VALUES (1,2,1),(2,2,2),(3,2,3),(4,2,4),(5,2,5),(6,2,6),(7,2,7);
/*!40000 ALTER TABLE `editor_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `states` (
  `state_id` int(10) unsigned NOT NULL,
  `state_name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Đã duyệt - Chờ xuất bản'),(2,'Đã xuất bản'),(3,'Bị từ chối'),(4,'Chưa được duyệt');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_timer`
--

DROP TABLE IF EXISTS `sub_timer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_timer` (
  `subscriber_id` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subsciber_id` (`subscriber_id`),
  CONSTRAINT `fk_subsciber_id` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_timer`
--

LOCK TABLES `sub_timer` WRITE;
/*!40000 ALTER TABLE `sub_timer` DISABLE KEYS */;
INSERT INTO `sub_timer` VALUES (4,1,'2021-06-09 14:19:34'),(4,2,'2021-06-23 14:19:39');
/*!40000 ALTER TABLE `sub_timer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategories` (
  `subcategory_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(255) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  KEY `fk_category_id_3` (`category_id`),
  CONSTRAINT `fk_category_id_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,'Nông sản',3),(2,'Hải sản',3);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'Noi dung tag_name_1'),(2,'Noi dung tag_name_2'),(6,'Hải sản'),(7,'Nông sản');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `rold_id` int(10) unsigned NOT NULL,
  `role_name` varchar(64) NOT NULL,
  PRIMARY KEY (`rold_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,'Subscriber'),(3,'Writer'),(4,'Editor'),(5,'Admin');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `role` int(10) unsigned NOT NULL COMMENT '2: Subber, 3: Writer, 4: Editor, 5: Admin',
  `pseudonym` varchar(255) DEFAULT NULL COMMENT 'But danh (neu role la 3)',
  `username` varchar(16) NOT NULL,
  `password` varchar(512) NOT NULL COMMENT 'Bcrypt password',
  `email` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_role` (`role`),
  CONSTRAINT `fk_role` FOREIGN KEY (`role`) REFERENCES `user_roles` (`rold_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Quốc Trung Admin',5,NULL,'trung','','trung@gmail.com','2021-06-01'),(2,'Trần Quốc Thắng Editor',4,NULL,'thang','','thang@gmail.com','2021-06-08'),(3,'Trần Chí Hào Writer',3,'ButDanhCuaHao','hao','','hao@gmail.com','2021-06-09'),(4,'Người Subscriber',2,NULL,'UserNameOfSub','','sub@gmail.com','2021-06-08'),(5,'Một writer nào đó',3,'Bút danh nào đó','random_writer','','random@gmail.com','2015-06-26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-12 23:49:57
