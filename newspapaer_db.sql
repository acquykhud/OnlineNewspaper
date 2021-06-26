/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1_3306
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : 127.0.0.1:3306
 Source Schema         : newspapaer_db

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 26/06/2021 14:43:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_subcategories
-- ----------------------------
DROP TABLE IF EXISTS `article_subcategories`;
CREATE TABLE `article_subcategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL,
  `subcategory_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_article_id_2` (`article_id`),
  KEY `fk_subcategory_id` (`subcategory_id`),
  CONSTRAINT `fk_article_id_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subcategory_id` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article_subcategories
-- ----------------------------
BEGIN;
INSERT INTO `article_subcategories` VALUES (1, 1, 1);
INSERT INTO `article_subcategories` VALUES (2, 2, 2);
INSERT INTO `article_subcategories` VALUES (3, 3, 1);
INSERT INTO `article_subcategories` VALUES (4, 4, 2);
COMMIT;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `article_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int(10) unsigned NOT NULL,
  `title` varchar(512) NOT NULL,
  `state` int(10) unsigned NOT NULL COMMENT '1: Da duyet - cho xuat ban, 2: Da xuat ban, 3: Bi tu choi, 4: Chua duoc duyet',
  `content` varchar(8192) NOT NULL COMMENT 'Luu bai viet ',
  `views` int(10) unsigned NOT NULL DEFAULT '0',
  `is_trending` int(1) NOT NULL DEFAULT '0' COMMENT '1: Co, 0: Khong',
  `is_premium` int(1) NOT NULL DEFAULT '0' COMMENT '1: Co, 0: Khong',
  `published_time` datetime DEFAULT NULL COMMENT 'Thoi gian xuat ban neu state la 2',
  `avatar_path` varchar(512) DEFAULT NULL COMMENT 'anh dai dien',
  `abstract` varchar(4096) DEFAULT NULL COMMENT 'tom tat bai viet',
  PRIMARY KEY (`article_id`),
  KEY `fk_author_id` (`author_id`),
  KEY `fk_state` (`state`),
  CONSTRAINT `fk_author_id` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_state` FOREIGN KEY (`state`) REFERENCES `states` (`state_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of articles
-- ----------------------------
BEGIN;
INSERT INTO `articles` VALUES (1, 3, 'Tiêu đề bài báo (Đã duyệt - Chờ xuất bản)', 1, 'Noi dung (da duoc duyet - cho xuat ban)', 100, 1, 0, NULL, NULL, NULL);
INSERT INTO `articles` VALUES (2, 3, 'Tiêu đề bài báo (Đã xuất bản)', 2, 'Noi dung (da xuat ban)', 200, 1, 0, NULL, NULL, NULL);
INSERT INTO `articles` VALUES (3, 3, 'Tiêu đề bài báo (Bị từ chối)', 3, 'Noi dung (bi tu choi)', 300, 0, 0, NULL, NULL, NULL);
INSERT INTO `articles` VALUES (4, 3, 'Tiêu đề bài báo (Chưa được duyệt)', 4, 'Noi dung (chua duoc duyet)', 400, 0, 1, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for articles_tags
-- ----------------------------
DROP TABLE IF EXISTS `articles_tags`;
CREATE TABLE `articles_tags` (
  `article_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_article_id` (`article_id`),
  KEY `fk_tag_id` (`tag_id`),
  CONSTRAINT `fk_article_id` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of articles_tags
-- ----------------------------
BEGIN;
INSERT INTO `articles_tags` VALUES (1, 1, 1);
INSERT INTO `articles_tags` VALUES (1, 2, 2);
INSERT INTO `articles_tags` VALUES (2, 1, 3);
INSERT INTO `articles_tags` VALUES (2, 2, 4);
INSERT INTO `articles_tags` VALUES (3, 1, 5);
INSERT INTO `articles_tags` VALUES (4, 2, 6);
COMMIT;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` VALUES (1, 'Noi dung category_name_1');
INSERT INTO `categories` VALUES (2, 'Noi dung category_name_2');
INSERT INTO `categories` VALUES (3, 'Kinh doanh');
INSERT INTO `categories` VALUES (4, 'Pháp luật');
INSERT INTO `categories` VALUES (5, 'Kinh tế');
INSERT INTO `categories` VALUES (6, 'Chính trị');
INSERT INTO `categories` VALUES (7, 'Xã hội');
COMMIT;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
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

-- ----------------------------
-- Records of comments
-- ----------------------------
BEGIN;
INSERT INTO `comments` VALUES (1, 1, '2021-06-26 14:14:50', 4, 'Noi dung comment tren bai 1');
INSERT INTO `comments` VALUES (2, 2, '2021-06-15 14:15:40', 4, 'Noi dung comment tren bai 2');
INSERT INTO `comments` VALUES (3, 3, '2021-07-27 14:16:07', 4, 'Noi dung comment tren bai 3');
INSERT INTO `comments` VALUES (4, 4, '2021-06-16 14:16:22', 4, 'Noi dung comment tren bai 4');
COMMIT;

-- ----------------------------
-- Table structure for declined_articles
-- ----------------------------
DROP TABLE IF EXISTS `declined_articles`;
CREATE TABLE `declined_articles` (
  `declined_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(10) unsigned NOT NULL,
  `decline_reason` varchar(4096) NOT NULL,
  `decline_time` datetime DEFAULT NULL,
  PRIMARY KEY (`declined_id`),
  KEY `fk_article_id_4` (`article_id`),
  CONSTRAINT `fk_article_id_4` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of declined_articles
-- ----------------------------
BEGIN;
INSERT INTO `declined_articles` VALUES (1, 3, 'Đây là lí do bị từ chối', '2021-06-16 14:18:05');
COMMIT;

-- ----------------------------
-- Table structure for editor_categories
-- ----------------------------
DROP TABLE IF EXISTS `editor_categories`;
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

-- ----------------------------
-- Records of editor_categories
-- ----------------------------
BEGIN;
INSERT INTO `editor_categories` VALUES (1, 2, 1);
INSERT INTO `editor_categories` VALUES (2, 2, 2);
INSERT INTO `editor_categories` VALUES (3, 2, 3);
INSERT INTO `editor_categories` VALUES (4, 2, 4);
INSERT INTO `editor_categories` VALUES (5, 2, 5);
INSERT INTO `editor_categories` VALUES (6, 2, 6);
INSERT INTO `editor_categories` VALUES (7, 2, 7);
COMMIT;

-- ----------------------------
-- Table structure for states
-- ----------------------------
DROP TABLE IF EXISTS `states`;
CREATE TABLE `states` (
  `state_id` int(10) unsigned NOT NULL,
  `state_name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of states
-- ----------------------------
BEGIN;
INSERT INTO `states` VALUES (1, 'Đã duyệt - Chờ xuất bản');
INSERT INTO `states` VALUES (2, 'Đã xuất bản');
INSERT INTO `states` VALUES (3, 'Bị từ chối');
INSERT INTO `states` VALUES (4, 'Chưa được duyệt');
COMMIT;

-- ----------------------------
-- Table structure for sub_timer
-- ----------------------------
DROP TABLE IF EXISTS `sub_timer`;
CREATE TABLE `sub_timer` (
  `subscriber_id` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subsciber_id` (`subscriber_id`),
  CONSTRAINT `fk_subsciber_id` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sub_timer
-- ----------------------------
BEGIN;
INSERT INTO `sub_timer` VALUES (4, 1, '2021-06-09 14:19:34');
INSERT INTO `sub_timer` VALUES (4, 2, '2021-06-23 14:19:39');
COMMIT;

-- ----------------------------
-- Table structure for subcategories
-- ----------------------------
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `subcategory_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(255) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  KEY `fk_category_id_3` (`category_id`),
  CONSTRAINT `fk_category_id_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of subcategories
-- ----------------------------
BEGIN;
INSERT INTO `subcategories` VALUES (1, 'Nông sản', 3);
INSERT INTO `subcategories` VALUES (2, 'Hải sản', 3);
COMMIT;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tags
-- ----------------------------
BEGIN;
INSERT INTO `tags` VALUES (1, 'Noi dung tag_name_1');
INSERT INTO `tags` VALUES (2, 'Noi dung tag_name_2');
COMMIT;

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `rold_id` int(10) unsigned NOT NULL,
  `role_name` varchar(64) NOT NULL,
  PRIMARY KEY (`rold_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
BEGIN;
INSERT INTO `user_roles` VALUES (2, 'Subscriber');
INSERT INTO `user_roles` VALUES (3, 'Writer');
INSERT INTO `user_roles` VALUES (4, 'Editor');
INSERT INTO `user_roles` VALUES (5, 'Admin');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'Nguyễn Quốc Trung Admin', 5, NULL, 'trung', '', 'trung@gmail.com', '2021-06-01');
INSERT INTO `users` VALUES (2, 'Trần Quốc Thắng Editor', 4, NULL, 'thang', '', 'thang@gmail.com', '2021-06-08');
INSERT INTO `users` VALUES (3, 'Trần Chí Hào Writer', 3, 'ButDanhCuaHao', 'hao', '', 'hao@gmail.com', '2021-06-09');
INSERT INTO `users` VALUES (4, 'Người Subscriber', 2, NULL, 'sub', '', 'sub@gmail.com', '2021-06-08');
INSERT INTO `users` VALUES (5, 'Một writer nào đó', 3, 'Bút danh nào đó', 'random_writer', '', 'random@gmail.com', '2015-06-26');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
