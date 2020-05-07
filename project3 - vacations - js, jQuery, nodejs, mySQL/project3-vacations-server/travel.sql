-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2020 at 08:43 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travel`
--

-- --------------------------------------------------------

--
-- Table structure for table `follow_vacation`
--

CREATE TABLE `follow_vacation` (
  `user_id` int(11) NOT NULL,
  `vacation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `follow_vacation`
--

INSERT INTO `follow_vacation` (`user_id`, `vacation_id`) VALUES
(2, 4),
(2, 13),
(2, 14),
(2, 15),
(3, 4),
(3, 13),
(3, 14),
(4, 3),
(4, 4),
(4, 5),
(4, 13),
(4, 14),
(5, 1),
(5, 14),
(6, 7),
(6, 13),
(6, 14),
(6, 15),
(7, 1),
(7, 7),
(7, 14),
(8, 13),
(8, 15);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(30) COLLATE utf8_bin NOT NULL,
  `last_name` varchar(30) COLLATE utf8_bin NOT NULL,
  `user_name` varchar(30) COLLATE utf8_bin NOT NULL,
  `password` varchar(30) COLLATE utf8_bin NOT NULL,
  `is_admin` varchar(5) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `user_name`, `password`, `is_admin`) VALUES
(1, 'mor', 'mor', 'mor', 'mor', 'true'),
(2, 'oz', 'oz', 'oz', 'oz', 'false'),
(3, 'sol', 'sol', 'sol', 'sol', 'false'),
(4, 'michal', 'michal', 'michal', 'michal', 'false'),
(5, 'ohad', 'ohad', 'ohad', 'ohad', 'false'),
(6, 'yael', 'yael', 'yael', 'yael', 'false'),
(7, 'hadar', 'hadar', 'hadar', 'hadar', 'false'),
(8, 'dor', 'dor', 'dor', 'dor', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `vacation`
--

CREATE TABLE `vacation` (
  `id` int(11) NOT NULL,
  `description` varchar(1000) COLLATE utf8_bin NOT NULL,
  `destination` varchar(56) COLLATE utf8_bin NOT NULL,
  `image` varchar(50) COLLATE utf8_bin NOT NULL,
  `fromDate` date NOT NULL,
  `toDate` date NOT NULL,
  `price` int(11) NOT NULL,
  `followers` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `vacation`
--

INSERT INTO `vacation` (`id`, `description`, `destination`, `image`, `fromDate`, `toDate`, `price`, `followers`) VALUES
(1, 'lorem ipsum dolor sit amet, consectetur adipiscing elit. ut pulsi recurrant? sed emolumenta communia esse dicuntur, recte autem facta et peccata non habentur communia. bonum integritas corporis: misera debilitas. atqui iste locus est, piso, tibi etiam atque etiam confirmandus, inquam;', 'Australia', 'australia-1581719307189.jpg', '2020-03-31', '2020-03-31', 120, 2),
(2, 'lorem ipsum dolor sit amet, per ei noster vivendum, vel meis liber an. sed augue noster temporibus et, ea vel porro iriure. efficiantur consequuntur sit ne. in sit diam alterum petentium, an delectus efficiendi vel.', 'Barcelona', 'barcelona-1581719354404.jpg', '2020-03-31', '2020-03-31', 100, 0),
(3, 'lorem ipsum dolor sit amet, atqui putent interesset at duo. vel diam atqui aperiri ne, dolore semper ex vel. eum nullam timeam nominavi te, ea nam veri sonet, atqui volutpat salutatus pri id. ea qui doctus aeterno neglegentur. ei ancillae appetere duo.', 'budapest', 'budapest-1581793496479.jpg', '2020-04-04', '2020-04-04', 100, 1),
(4, 'lorem ipsum dolor sit amet, eu quo natum conceptam disputationi, et mea equidem eleifend scriptorem, at sit verear voluptua signiferumque. et qui idque atomorum. adhuc perfecto ea mei. dico iudico scribentur pro ei. mel ex esse eius tractatos, per detracto pertinacia id.', 'china', 'china-1581793528660.jpg', '2020-04-04', '2020-04-04', 300, 3),
(5, 'lorem ipsum dolor sit amet, eu nibh porro facilisis mei. eu mei clita diceret, meliore sapientem referrentur ius an. cu qui justo nostro, mei ad audire impetus nusquam, at nam simul diceret convenire. sed noster possim ocurreret an. natum philosophia no eum, an ridens nostro eruditi eam. tamquam definitionem ad est, nec te veniam neglegentur, aliquip pertinacia sed cu.', 'finland', 'finland-1581793562735.jpg', '2020-04-04', '2020-04-04', 350, 1),
(7, 'lorem ipsum dolor sit amet, at postea expetendis vel. sea ex prompta pertinax, has id viderer menandri. commune appareat sit cu, ad sumo atqui mel, his ipsum imperdiet ne. ex vis probo posse lobortis, has ne homero iriure, nam cu soluta aliquando. cu mea aliquip placerat, sit at dicta conclusionemque.', 'japan', 'japan-1581793624005.jpg', '2020-04-04', '2020-04-04', 600, 2),
(8, 'lorem ipsum dolor sit amet, populo suscipiantur vim cu, cu nibh partem vis, odio euismod minimum vim et. no vis gubergren consequuntur conclusionemque, mei sint dolorem expetendis ut. nam eu agam inimicus. vis id dictas mnesarchum complectitur, sea suas utinam cu, mea in rebum fierent.', 'prague', 'prague-1581793682581.jpg', '2020-04-04', '2020-04-04', 50, 0),
(10, 'lorem ipsum dolor sit amet, ad electram sapientem qui, sed ne solum feugiat euripidis. assum officiis inciderint quo no, in habeo dicant expetenda qui. id persius iudicabit eos, ad eos alia aeterno delicata. veniam gloriatur no nec.', 'Austria', 'austria-1581794301030.jpg', '2020-04-04', '2020-04-04', 100, 0),
(13, 'lorem ipsum dolor sit amet, cu liber voluptua volutpat his. ei has solet graece indoctum, vix te erant omnes. utamur dolorum te sed, commune deleniti invidunt te mea. conceptam sententiae ius ne. his in posse essent, sea audire intellegebat disputationi ea.', 'Thailand', 'thailand-1581794366159.jpg', '2020-05-05', '2020-05-05', 270, 5),
(14, 'lorem ipsum dolor sit amet, numquam euismod tincidunt cum et, vim aeque dicunt diceret eu. tamquam signiferumque sit eu. in pro brute feugait moderatius. vis in possit vituperatoribus. docendi sadipscing usu et, nullam albucius praesent sit ne.', 'grece', 'grece-1581794651568.jpg', '2020-04-04', '2020-04-04', 60, 6),
(15, 'lorem ipsum dolor sit amet, eos unum scriptorem necessitatibus ut, per antiopam consetetur percipitur cu. et hinc purto probatus vel, his conceptam theophrastus eu, te qui causae debitis. fastidii torquatos ea vix. qui utinam blandit interpretaris an, idque zril pri ut, postea veritus at eum.', 'ireLand', 'ireland-1581794781371.jpg', '2020-04-04', '2020-04-04', 600, 3),
(16, 'lorem ipsum dolor sit amet, eum at aperiri debitis, duo ne sumo decore vivendo. prima dignissim usu at. te autem phaedrum referrentur per, nec ad case everti, cu quod aperiam lucilius his. sed in saperet disputationi, dicat numquam persequeris sed an. posse error disputando no vim, quo an oratio commune petentium.', 'sweden', 'sweden-1581795342815.jpg', '2020-04-04', '2020-04-04', 390, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `follow_vacation`
--
ALTER TABLE `follow_vacation`
  ADD PRIMARY KEY (`user_id`,`vacation_id`),
  ADD KEY `fk_vacation_id` (`vacation_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vacation`
--
ALTER TABLE `vacation`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `vacation`
--
ALTER TABLE `vacation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `follow_vacation`
--
ALTER TABLE `follow_vacation`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `fk_vacation_id` FOREIGN KEY (`vacation_id`) REFERENCES `vacation` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
