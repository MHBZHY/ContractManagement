/*
 Navicat Premium Data Transfer

 Source Server         : local_root
 Source Server Type    : MySQL
 Source Server Version : 50711
 Source Host           : localhost
 Source Database       : ContractManagement

 Target Server Type    : MySQL
 Target Server Version : 50711
 File Encoding         : utf-8

 Date: 07/02/2016 13:01:07 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `contract`
-- ----------------------------
DROP TABLE IF EXISTS `contract`;
CREATE TABLE `contract` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `path` varchar(140) NOT NULL,
  `date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `name` varchar(40) NOT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `password` varchar(18) NOT NULL,
  `isadmin` int(1) NOT NULL DEFAULT '0',
  `date` varchar(20) NOT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('zhy', '1', '248326', '1', '24/06/2016', null, null), ('test', '2', '248326', '0', '29/06/2016', null, null);
COMMIT;

-- ----------------------------
--  Table structure for `user_contract`
-- ----------------------------
DROP TABLE IF EXISTS `user_contract`;
CREATE TABLE `user_contract` (
  `user_id` int(10) NOT NULL,
  `contract_id` int(10) NOT NULL,
  `select` int(1) NOT NULL DEFAULT '0',
  `update` int(1) NOT NULL DEFAULT '0',
  `insert` int(1) NOT NULL DEFAULT '0',
  `delete` int(1) NOT NULL DEFAULT '0',
  KEY `user_id` (`user_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `contract_id` FOREIGN KEY (`contract_id`) REFERENCES `contract` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Triggers structure for table user_contract
-- ----------------------------
DROP TRIGGER IF EXISTS `delete_contract`;
delimiter ;;
CREATE TRIGGER `delete_contract` AFTER DELETE ON `user_contract` FOR EACH ROW BEGIN
    DELETE FROM contract
      WHERE id = old.contract_id;
  END
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
