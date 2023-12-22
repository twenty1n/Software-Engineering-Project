-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2023 at 12:08 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `servicex`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_id` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `category_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_id`, `category_title`) VALUES
(1, 'C001', 'Clean'),
(2, 'C002', 'Repair'),
(3, 'C003', 'Pest Control'),
(4, 'C004', 'Cooking'),
(5, 'C005', 'Laundry');

--
-- Triggers `category`
--
DELIMITER $$
CREATE TRIGGER `before_insert_category` BEFORE INSERT ON `category` FOR EACH ROW SET NEW.category_id = CONCAT('C', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='category'), 3, '0'))
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `provider`
--

CREATE TABLE `provider` (
  `id` int(11) NOT NULL,
  `provider_id` varchar(4) NOT NULL,
  `provider_name` varchar(40) DEFAULT NULL,
  `provider_DateOfBirth` varchar(10) DEFAULT NULL,
  `provider_address` varchar(23) DEFAULT NULL,
  `provider_email` varchar(22) DEFAULT NULL,
  `provider_phone` varchar(9) DEFAULT NULL,
  `provider_gender` varchar(6) DEFAULT NULL,
  `provider_password` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `provider`
--

INSERT INTO `provider` (`id`, `provider_id`, `provider_name`, `provider_DateOfBirth`, `provider_address`, `provider_email`, `provider_phone`, `provider_gender`, `provider_password`) VALUES
(1, 'P001', 'Hermione ', '1984-01-06', 'bangmod', 'hermione41@gmail.com', '+92381572', 'Female', 'hermione12'),
(2, 'P002', 'Silas', '2017-05-07', 'bangbon 10150', 'silas215@outlook.com', '+37502312', 'Female', 'silas215'),
(3, 'P003', 'Abbey', '1969-04-12', 'South Australia 55223', 'abbeykatie@gmail.com', '+87360346', 'Female', 'abbeykatie'),
(5, 'P005', 'Susan', '1996-08-07', 'Indiana 46001', 'susanhanna@outlook.com', '+98672182', 'Female', 'susanhanna'),
(6, 'P006', 'Kin Ruji', '2003-05-01', 'nakornpathom', 'kin', '098936939', 'Male', 'kin'),
(7, 'P007', 'Sha ya', '2003-08-12', 'thung khru 10140', 'lb', '098936939', 'Female', 'lb'),
(8, 'P008', 'Emily', '1990-03-22', '456 Oak Avenue, Townsvi', 'emily.johnson@gmail.co', '098936939', 'Female', 'Emily456'),
(9, 'P009', 'John Smit', '1985-08-15', '123 Main Street, Cityvi', 'john.smith@gmail.com', '+1 (555) ', 'Male', 'John123'),
(10, 'P010', 'Sarah Mil', '1988-06-10', '234 Cedar Street, Hamle', 'sarah.miller@gmail.com', '1111', 'Female', 'Sarah55'),
(11, 'P011', 'Robert Chang', '1992-02-28', ' 567 Birch Road, Suburb', 'robert.chang@gmail.com', '+1 (555) ', 'Male', 'Robert88'),
(12, 'P012', 'Jessica Williams', '1980-09-15', 'Maple Avenue, Cityscape', 'jessica.william@gmail.', '+1 (555) ', 'Female', 'Jessica567'),
(13, 'P013', 'Daniel Rodriguez', '1975-04-03', '123 Pine Street, Metrov', 'kin@gmail.com', '+1 (555) ', 'Male', 'D789');

--
-- Triggers `provider`
--
DELIMITER $$
CREATE TRIGGER `before_insert_provider` BEFORE INSERT ON `provider` FOR EACH ROW SET NEW.provider_id = CONCAT('P', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='provider'), 3, '0'))
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `provideservice`
--

CREATE TABLE `provideservice` (
  `id` int(11) NOT NULL,
  `provideservice_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `provider_id` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `service_id` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provideservice`
--

INSERT INTO `provideservice` (`id`, `provideservice_id`, `provider_id`, `service_id`) VALUES
(1, 'PS001', 'P001', 'SV001'),
(2, 'PS002', 'P006', 'SV002'),
(3, 'PS003', 'P006', 'SV003'),
(4, 'PS004', 'P006', 'SV004'),
(5, 'PS005', 'P006', 'SV005'),
(6, 'PS006', 'P006', 'SV006'),
(7, 'PS007', 'P007', 'SV007'),
(8, 'PS008', 'P005', 'SV008'),
(9, 'PS009', 'P006', 'SV009'),
(10, 'PS010', 'P006', 'SV010'),
(11, 'PS011', 'P001', 'SV011'),
(12, 'PS012', 'P001', 'SV012'),
(13, 'PS013', 'P001', 'SV013'),
(14, 'PS014', 'P006', 'SV014'),
(15, 'PS015', 'P001', 'SV015');

--
-- Triggers `provideservice`
--
DELIMITER $$
CREATE TRIGGER `before_insert_provideservice` BEFORE INSERT ON `provideservice` FOR EACH ROW SET NEW.provideservice_id = CONCAT('PS', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='provideservice'), 3, '0'))
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_serviceintable` BEFORE INSERT ON `provideservice` FOR EACH ROW SET NEW.service_id = CONCAT('SV', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='provideservice'), 3, '0'))
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `reservation_id` varchar(4) NOT NULL,
  `seeker_id` varchar(4) DEFAULT NULL,
  `provider_id` varchar(4) DEFAULT NULL,
  `service_id` varchar(5) DEFAULT NULL,
  `reservation_time` varchar(9) DEFAULT NULL,
  `reservation_date` varchar(10) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `reservation_id`, `seeker_id`, `provider_id`, `service_id`, `reservation_time`, `reservation_date`, `status`) VALUES
(1, 'R001', 'S002', 'P001', 'SV001', 'Evening', '2023-11-22', 'Completed'),
(2, 'R002', 'S002', 'P006', 'SV002', 'Morning', '2023-11-24', 'Completed'),
(3, 'R003', 'S002', 'P006', 'SV002', 'Evening', '2023-11-23', 'Completed'),
(4, 'R004', 'S002', 'P007', 'SV007', 'Evening', '2023-11-30', 'Completed'),
(5, 'R005', 'S002', 'P005', 'SV008', 'Morning', '2023-11-23', 'Processing'),
(6, 'R006', 'S003', 'P001', 'SV011', 'Evening', '2023-12-11', 'Processing'),
(7, 'R007', 'S003', 'P001', 'SV013', 'Morning', '2023-12-10', 'Completed'),
(8, 'R008', 'S003', 'P001', 'SV012', 'Morning', '2023-12-11', 'Cancelled'),
(9, 'R009', 'S003', 'P006', 'SV002', 'Evening', '2023-12-11', 'Processing');

--
-- Triggers `reservation`
--
DELIMITER $$
CREATE TRIGGER `before_insert_reservation` BEFORE INSERT ON `reservation` FOR EACH ROW SET NEW.reservation_id = CONCAT('R', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='reservation'), 3, '0'))
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `seeker`
--

CREATE TABLE `seeker` (
  `id` int(11) NOT NULL,
  `seeker_id` varchar(4) NOT NULL,
  `seeker_name` varchar(8) DEFAULT NULL,
  `seeker_DateOfBirth` varchar(10) DEFAULT NULL,
  `seeker_address` varchar(31) DEFAULT NULL,
  `seeker_email` varchar(18) DEFAULT NULL,
  `seeker_phone` varchar(9) DEFAULT NULL,
  `seeker_gender` varchar(6) DEFAULT NULL,
  `seeker_password` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `seeker`
--

INSERT INTO `seeker` (`id`, `seeker_id`, `seeker_name`, `seeker_DateOfBirth`, `seeker_address`, `seeker_email`, `seeker_phone`, `seeker_gender`, `seeker_password`) VALUES
(1, 'S001', 'Haerin K', '2006-05-15', 'gimcheon seoul', 'meow06@gmail.com', '060606060', 'Female', 'haerinhaerin'),
(2, 'S002', 'Rin Lim', '2003-04-09', 'bangbon 10150', 'rin', '061949663', 'Female', 'rin');

--
-- Triggers `seeker`
--
DELIMITER $$
CREATE TRIGGER `before_insert_seeker` BEFORE INSERT ON `seeker` FOR EACH ROW SET NEW.seeker_id = CONCAT('S', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='seeker'), 3, '0'))
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `service_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `service_description` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `service_cost` varchar(40) DEFAULT NULL,
  `category_id` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `service_id` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `service_title`, `service_description`, `service_cost`, `category_id`, `service_id`) VALUES
(1, 'Plumbing', 'Plumbing services', '$100', 'C001', 'SV001'),
(2, 'Cleaning', 'Professional Cleaning services', '$80', 'C001', 'SV002'),
(3, 'HVAC', 'Heating, Ventilation, and Air Conditioning services', '$150', 'C002', 'SV003'),
(4, 'Termite Extermination', 'Effective termite extermination services to protect your home from structural damage.', '$200', 'C003', 'SV004'),
(5, 'Personal Chef Service', 'Enjoy a personalized culinary experience with a professional chef cooking in your home.', '$250', 'C004', 'SV005'),
(6, 'Wash and Fold', 'Wash and Fold', '$50', 'C005', 'SV006'),
(7, ' Window Cleaning', 'Professional cleaning of windows, leaving them streak-free and crystal clear.', ' $80', 'C001', 'SV007'),
(8, 'Rodent Removal', 'Humane removal of rodents and preventive measures to keep them away from your property.', '$180', 'C003', 'SV008'),
(9, 'Plumbing Repairs', ' Fixing leaks, repairing pipes, and addressing plumbing issues to ensure smooth water flow.', '$120', 'C002', 'SV009'),
(10, 'Deep Cleaning', 'Thorough cleaning of all rooms, including dusting, vacuuming, and sanitizing surfaces.', '$100', 'C001', 'SV010'),
(11, 'Cooking Classes', 'Interactive cooking classes with a professional chef, learning new recipes and culinary techniques.', ' $80 per person', 'C004', 'SV011'),
(12, 'Dinner Party Catering', 'Full-service catering for your special dinner party, including a customized menu and professional staff.', '$300', 'C004', 'SV012'),
(13, 'Bedding and Linen Service', 'Laundering and pressing of bed linens, duvet covers, and pillowcases for a fresh and comfortable bed.', '$60', 'C005', 'SV013'),
(14, 'Carpet Cleaning', 'Professional carpet cleaning to remove stains, odors, and allergens, leaving your carpets refreshed.', '$120', 'C001', 'SV014'),
(15, 'test', 'test', 'test', 'C003', 'SV015');

--
-- Triggers `service`
--
DELIMITER $$
CREATE TRIGGER `before_insert_service` BEFORE INSERT ON `service` FOR EACH ROW SET NEW.service_id = CONCAT('SV', LPAD((SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='service'), 3, '0'))
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider`
--
ALTER TABLE `provider`
  ADD PRIMARY KEY (`id`,`provider_id`),
  ADD KEY `idx_provider_id` (`provider_id`);

--
-- Indexes for table `provideservice`
--
ALTER TABLE `provideservice`
  ADD PRIMARY KEY (`id`,`provideservice_id`,`provider_id`,`service_id`),
  ADD KEY `fk_service` (`service_id`),
  ADD KEY `fk_provider` (`provider_id`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`,`reservation_id`),
  ADD KEY `fk_provider` (`provider_id`),
  ADD KEY `fk_seeker` (`seeker_id`),
  ADD KEY `fk_service` (`service_id`);

--
-- Indexes for table `seeker`
--
ALTER TABLE `seeker`
  ADD PRIMARY KEY (`id`,`seeker_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`,`service_id`),
  ADD KEY `idx_service_id` (`service_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `provider`
--
ALTER TABLE `provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `provideservice`
--
ALTER TABLE `provideservice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `seeker`
--
ALTER TABLE `seeker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
