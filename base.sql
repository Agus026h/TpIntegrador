-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-06-2025 a las 06:21:05
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospital2`
--
CREATE DATABASE IF NOT EXISTS `hospital2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hospital2`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admision`
--

CREATE TABLE `admision` (
  `id_admision` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_cama` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` varchar(60) NOT NULL,
  `tipo_ingreso` enum('emergencia','programada','derivada') NOT NULL,
  `estado` enum('activa','cancelada','finalizada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admision`
--

INSERT INTO `admision` (`id_admision`, `id_paciente`, `id_cama`, `fecha`, `motivo`, `tipo_ingreso`, `estado`) VALUES
(1, 1, 1, '2025-06-16', 'pierna rota', 'programada', 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ala`
--

CREATE TABLE `ala` (
  `id_ala` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ala`
--

INSERT INTO `ala` (`id_ala`, `nombre`) VALUES
(1, 'cirugia'),
(2, 'terapia intensiva'),
(3, 'maternidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cama`
--

CREATE TABLE `cama` (
  `id_cama` int(11) NOT NULL,
  `estado` enum('libre','ocupada','higienizacion') NOT NULL DEFAULT 'libre',
  `id_habitacion` int(11) NOT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cama`
--

INSERT INTO `cama` (`id_cama`, `estado`, `id_habitacion`, `numero`) VALUES
(1, 'ocupada', 2, 1),
(2, 'libre', 2, 2),
(3, 'higienizacion', 1, 1),
(4, 'libre', 1, 2),
(5, 'libre', 3, 1),
(6, 'libre', 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `id_habitacion` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `id_ala` int(11) NOT NULL,
  `capacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`id_habitacion`, `numero`, `id_ala`, `capacidad`) VALUES
(1, 1, 1, 2),
(2, 2, 2, 2),
(3, 3, 3, 2),
(4, 4, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `id_paciente` int(11) NOT NULL,
  `dni` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('m','f','otro') NOT NULL,
  `direccion` varchar(120) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contacto_emergencia` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`id_paciente`, `dni`, `nombre`, `apellido`, `fecha_nacimiento`, `sexo`, `direccion`, `telefono`, `email`, `contacto_emergencia`, `estado`) VALUES
(1, 42133524, 'Francisco Agustin', 'Herrera Calderon', '2025-06-06', 'm', 'calle falsa2', '2664275436', 'agustin201h@gmail.com', 'martina 266482984', 1),
(2, 12345678, 'martina', 'lucero', '1999-07-16', 'f', 'calle falsa2', '266427543655', 'martina@gmail.com', 'martina 266482984', 0),
(3, 44567821, 'matias', 'gomez', '2025-06-03', 'm', 'calle falsa2', '2664567565', 'matg@gmail.com', 'martina 266482984', 1),
(4, 33678954, 'anna', 'escudero', '2021-02-16', 'm', 'calle falsa2', '2665897563', 'annaEscud@gmail.com', 'martina 266482984', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admision`
--
ALTER TABLE `admision`
  ADD PRIMARY KEY (`id_admision`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_cama` (`id_cama`);

--
-- Indices de la tabla `ala`
--
ALTER TABLE `ala`
  ADD PRIMARY KEY (`id_ala`);

--
-- Indices de la tabla `cama`
--
ALTER TABLE `cama`
  ADD PRIMARY KEY (`id_cama`),
  ADD KEY `id_habitacion` (`id_habitacion`);

--
-- Indices de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD PRIMARY KEY (`id_habitacion`),
  ADD KEY `id_ala` (`id_ala`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `dni` (`dni`,`email`),
  ADD UNIQUE KEY `paciente_dni_email` (`dni`,`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admision`
--
ALTER TABLE `admision`
  MODIFY `id_admision` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ala`
--
ALTER TABLE `ala`
  MODIFY `id_ala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cama`
--
ALTER TABLE `cama`
  MODIFY `id_cama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  MODIFY `id_habitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admision`
--
ALTER TABLE `admision`
  ADD CONSTRAINT `admision_ibfk_19` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `admision_ibfk_20` FOREIGN KEY (`id_cama`) REFERENCES `cama` (`id_cama`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `cama`
--
ALTER TABLE `cama`
  ADD CONSTRAINT `cama_ibfk_1` FOREIGN KEY (`id_habitacion`) REFERENCES `habitacion` (`id_habitacion`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD CONSTRAINT `habitacion_ibfk_1` FOREIGN KEY (`id_ala`) REFERENCES `ala` (`id_ala`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
