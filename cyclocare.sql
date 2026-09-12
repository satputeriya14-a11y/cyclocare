-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 12, 2026 at 08:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cyclocare`
--

-- --------------------------------------------------------

--
-- Table structure for table `periods`
--

CREATE TABLE `periods` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `period_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periods`
--

INSERT INTO `periods` (`id`, `user_id`, `period_date`, `created_at`) VALUES
(1, 5, '2026-08-27', '2026-09-10 16:19:31'),
(2, 5, '2026-09-12', '2026-09-10 16:38:36'),
(3, 5, '2026-08-10', '2026-09-11 05:18:31'),
(5, 5, '2026-09-12', '2026-09-11 14:31:00'),
(6, 5, '2026-09-12', '2026-09-11 14:56:58'),
(7, 5, '2026-09-12', '2026-09-11 15:44:33'),
(8, 5, '2026-09-10', '2026-09-11 15:56:11');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `medication` varchar(150) NOT NULL,
  `reminder_date` date NOT NULL,
  `reminder_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `user_id`, `medication`, `reminder_date`, `reminder_time`, `created_at`) VALUES
(1, 5, 'test reminder', '2026-09-12', '07:15:00', '2026-09-10 16:38:26'),
(2, 5, 'vitamins', '2026-09-10', '09:00:00', '2026-09-11 05:19:32'),
(3, 5, 'walk', '2026-09-11', '08:00:00', '2026-09-11 05:23:40'),
(4, 5, 'painkiller', '2026-09-12', '12:00:00', '2026-09-11 05:30:20'),
(5, 5, 'drink water', '2026-09-12', '07:15:00', '2026-09-11 05:44:13'),
(7, 5, 'vhgva', '2026-09-12', '01:30:00', '2026-09-11 14:49:06'),
(8, 5, 'abcd', '2026-09-12', '06:10:00', '2026-09-11 15:38:32'),
(12, 5, 'nbn', '2026-09-12', '05:00:00', '2026-09-11 19:28:59');

-- --------------------------------------------------------

--
-- Table structure for table `symptoms`
--

CREATE TABLE `symptoms` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `symptom` varchar(100) NOT NULL,
  `symptom_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `symptoms`
--

INSERT INTO `symptoms` (`id`, `user_id`, `symptom`, `symptom_date`, `created_at`) VALUES
(1, 5, 'cramps', '2026-09-10', '2026-09-10 16:25:03'),
(2, 5, 'headache', '2026-09-11', '2026-09-11 05:18:54'),
(4, 5, 'fatigue', '2026-09-11', '2026-09-11 15:44:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'ria', 'riasatpute@gmail.com', '$2y$10$A4/5mEBDfaSj.bKKGzjJrOx0nUk2PY.9PuQnzzxJDZ.2EGWBdEw9m', '2026-09-06 20:04:40'),
(3, 'ria', 'queen@gmail.com', '$2y$10$Fl/j6lkzOlgNVqXNvl4mw.QteGy1SE1JpsOSx/5xsrK7fS9FW7Ebq', '2026-09-06 20:07:06'),
(4, 'Riya Satpute', 'xyz@gmail.com', '$2y$10$AxVA7B7IpmaO3/c8ENZamugsC6OY41QazUARL41A4j29DvFNZSNsy', '2026-09-07 04:46:18'),
(5, 'Priti sharma', 'priti@gmail.com', '$2y$10$GZtsw/kLDvEX29RoyFfmdOaeMssYf/pWfz.rIWVn4J/PN86HcaFgC', '2026-09-10 16:13:06'),
(6, 'prachi', 'prachi@gmail.com', '$2y$10$Mhyk/Z9mY.TM22yBgRbSa.0KX1LXhNLxys4yIEFXcyEo/rgIP1aqG', '2026-09-11 05:51:23'),
(7, 'testuser', 'test@gmail.com', '$2y$10$nqxX1BLjL7SqNHulJSAVFOa3LPKFNNxyN/8lFSmM6thn6dpCxglx6', '2026-09-11 15:58:40'),
(8, 'test1', 'test1@gmail.com', '$2y$10$XSQK/6lXW3OVLvbiEshGXO5DHtFLHzOF.B7VKICM5/oy8yCN0BK/.', '2026-09-11 16:45:55'),
(9, 'shikha', 'shikha@gmail.com', '$2y$10$AwuB94BS70dTIe/1eWDfw.XA8BDT0QXjZWpy4kiHTQC4flnAjarQG', '2026-09-11 18:52:54'),
(10, 'Siyaa', 'siya@gmail.com', '$2y$10$XAaRIJQWhgJ0K9JgynssgO1/XiJekgfgWTszD5pXnohj9aIE5eOIi', '2026-09-11 18:59:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `periods`
--
ALTER TABLE `periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `symptoms`
--
ALTER TABLE `symptoms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `periods`
--
ALTER TABLE `periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `symptoms`
--
ALTER TABLE `symptoms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `periods`
--
ALTER TABLE `periods`
  ADD CONSTRAINT `periods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `symptoms`
--
ALTER TABLE `symptoms`
  ADD CONSTRAINT `symptoms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
