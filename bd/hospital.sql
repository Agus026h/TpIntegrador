-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-06-2025 a las 02:11:00
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
-- Base de datos: `hospital`
--
CREATE DATABASE IF NOT EXISTS `hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hospital`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admision`
--

CREATE TABLE `admision` (
  `idAdmision` int(11) NOT NULL,
  `idPaciente` int(11) NOT NULL,
  `idUsuarioRecepcion` int(11) NOT NULL,
  `fechaIngreso` datetime NOT NULL,
  `motivo` text DEFAULT NULL,
  `tipoIngreso` enum('Emergencia','Programada','Derivada') NOT NULL,
  `idCama` int(11) NOT NULL,
  `estado` enum('Activa','Cancelada','Finalizada') DEFAULT 'Activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ala`
--

CREATE TABLE `ala` (
  `idAla` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `altahospitalaria`
--

CREATE TABLE `altahospitalaria` (
  `idAlta` int(11) NOT NULL,
  `idAdmision` int(11) NOT NULL,
  `fechaAlta` datetime NOT NULL,
  `observaciones` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `antecedentemedico`
--

CREATE TABLE `antecedentemedico` (
  `idAntecedente` int(11) NOT NULL,
  `idEvaluacionEnf` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` enum('Alergia','Enfermedad','Cirugía','Familiar','Otro') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cama`
--

CREATE TABLE `cama` (
  `idCama` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `idHabitacion` int(11) NOT NULL,
  `estado` enum('Libre','Ocupada','Higienización') NOT NULL DEFAULT 'Libre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico`
--

CREATE TABLE `diagnostico` (
  `idDiagnostico` int(11) NOT NULL,
  `idEvaluacionMed` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacionenfermeria`
--

CREATE TABLE `evaluacionenfermeria` (
  `idEvaluacionEnf` int(11) NOT NULL,
  `idAdmision` int(11) NOT NULL,
  `idUsuarioEnfermero` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `motivo` text DEFAULT NULL,
  `planCuidados` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacionmedica`
--

CREATE TABLE `evaluacionmedica` (
  `idEvaluacionMed` int(11) NOT NULL,
  `idAdmision` int(11) NOT NULL,
  `idUsuarioMedico` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `idHabitacion` int(11) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `idAla` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialcancelaciones`
--

CREATE TABLE `historialcancelaciones` (
  `idCancelacion` int(11) NOT NULL,
  `idAdmision` int(11) NOT NULL,
  `fechaCancelacion` datetime NOT NULL,
  `motivo` text DEFAULT NULL,
  `usuarioCancelo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `idPaciente` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `sexo` enum('M','F','Otro') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contactoEmergencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `signosvitales`
--

CREATE TABLE `signosvitales` (
  `idSignos` int(11) NOT NULL,
  `idEvaluacionEnf` int(11) NOT NULL,
  `presionArterial` varchar(20) DEFAULT NULL,
  `frecuenciaCardiaca` int(11) DEFAULT NULL,
  `frecuenciaRespiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamiento`
--

CREATE TABLE `tratamiento` (
  `idTratamiento` int(11) NOT NULL,
  `idEvaluacionMed` int(11) NOT NULL,
  `medicamento` text DEFAULT NULL,
  `dosis` text DEFAULT NULL,
  `frecuencia` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `rol` enum('Médico','Enfermero','Recepcionista','Admin') NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admision`
--
ALTER TABLE `admision`
  ADD PRIMARY KEY (`idAdmision`),
  ADD KEY `idPaciente` (`idPaciente`),
  ADD KEY `idUsuarioRecepcion` (`idUsuarioRecepcion`),
  ADD KEY `idCama` (`idCama`);

--
-- Indices de la tabla `ala`
--
ALTER TABLE `ala`
  ADD PRIMARY KEY (`idAla`);

--
-- Indices de la tabla `altahospitalaria`
--
ALTER TABLE `altahospitalaria`
  ADD PRIMARY KEY (`idAlta`),
  ADD KEY `idAdmision` (`idAdmision`);

--
-- Indices de la tabla `antecedentemedico`
--
ALTER TABLE `antecedentemedico`
  ADD PRIMARY KEY (`idAntecedente`),
  ADD KEY `idEvaluacionEnf` (`idEvaluacionEnf`);

--
-- Indices de la tabla `cama`
--
ALTER TABLE `cama`
  ADD PRIMARY KEY (`idCama`),
  ADD KEY `idHabitacion` (`idHabitacion`);

--
-- Indices de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  ADD PRIMARY KEY (`idDiagnostico`),
  ADD KEY `idEvaluacionMed` (`idEvaluacionMed`);

--
-- Indices de la tabla `evaluacionenfermeria`
--
ALTER TABLE `evaluacionenfermeria`
  ADD PRIMARY KEY (`idEvaluacionEnf`),
  ADD KEY `idAdmision` (`idAdmision`),
  ADD KEY `idUsuarioEnfermero` (`idUsuarioEnfermero`);

--
-- Indices de la tabla `evaluacionmedica`
--
ALTER TABLE `evaluacionmedica`
  ADD PRIMARY KEY (`idEvaluacionMed`),
  ADD KEY `idAdmision` (`idAdmision`),
  ADD KEY `idUsuarioMedico` (`idUsuarioMedico`);

--
-- Indices de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD PRIMARY KEY (`idHabitacion`),
  ADD KEY `idAla` (`idAla`);

--
-- Indices de la tabla `historialcancelaciones`
--
ALTER TABLE `historialcancelaciones`
  ADD PRIMARY KEY (`idCancelacion`),
  ADD KEY `idAdmision` (`idAdmision`),
  ADD KEY `usuarioCancelo` (`usuarioCancelo`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`idPaciente`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `signosvitales`
--
ALTER TABLE `signosvitales`
  ADD PRIMARY KEY (`idSignos`),
  ADD KEY `idEvaluacionEnf` (`idEvaluacionEnf`);

--
-- Indices de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD PRIMARY KEY (`idTratamiento`),
  ADD KEY `idEvaluacionMed` (`idEvaluacionMed`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admision`
--
ALTER TABLE `admision`
  MODIFY `idAdmision` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ala`
--
ALTER TABLE `ala`
  MODIFY `idAla` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `altahospitalaria`
--
ALTER TABLE `altahospitalaria`
  MODIFY `idAlta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `antecedentemedico`
--
ALTER TABLE `antecedentemedico`
  MODIFY `idAntecedente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cama`
--
ALTER TABLE `cama`
  MODIFY `idCama` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  MODIFY `idDiagnostico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluacionenfermeria`
--
ALTER TABLE `evaluacionenfermeria`
  MODIFY `idEvaluacionEnf` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluacionmedica`
--
ALTER TABLE `evaluacionmedica`
  MODIFY `idEvaluacionMed` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  MODIFY `idHabitacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historialcancelaciones`
--
ALTER TABLE `historialcancelaciones`
  MODIFY `idCancelacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `idPaciente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `signosvitales`
--
ALTER TABLE `signosvitales`
  MODIFY `idSignos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  MODIFY `idTratamiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admision`
--
ALTER TABLE `admision`
  ADD CONSTRAINT `admision_ibfk_1` FOREIGN KEY (`idPaciente`) REFERENCES `paciente` (`idPaciente`),
  ADD CONSTRAINT `admision_ibfk_2` FOREIGN KEY (`idUsuarioRecepcion`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `admision_ibfk_3` FOREIGN KEY (`idCama`) REFERENCES `cama` (`idCama`);

--
-- Filtros para la tabla `altahospitalaria`
--
ALTER TABLE `altahospitalaria`
  ADD CONSTRAINT `altahospitalaria_ibfk_1` FOREIGN KEY (`idAdmision`) REFERENCES `admision` (`idAdmision`);

--
-- Filtros para la tabla `antecedentemedico`
--
ALTER TABLE `antecedentemedico`
  ADD CONSTRAINT `antecedentemedico_ibfk_1` FOREIGN KEY (`idEvaluacionEnf`) REFERENCES `evaluacionenfermeria` (`idEvaluacionEnf`);

--
-- Filtros para la tabla `cama`
--
ALTER TABLE `cama`
  ADD CONSTRAINT `cama_ibfk_1` FOREIGN KEY (`idHabitacion`) REFERENCES `habitacion` (`idHabitacion`);

--
-- Filtros para la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  ADD CONSTRAINT `diagnostico_ibfk_1` FOREIGN KEY (`idEvaluacionMed`) REFERENCES `evaluacionmedica` (`idEvaluacionMed`);

--
-- Filtros para la tabla `evaluacionenfermeria`
--
ALTER TABLE `evaluacionenfermeria`
  ADD CONSTRAINT `evaluacionenfermeria_ibfk_1` FOREIGN KEY (`idAdmision`) REFERENCES `admision` (`idAdmision`),
  ADD CONSTRAINT `evaluacionenfermeria_ibfk_2` FOREIGN KEY (`idUsuarioEnfermero`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `evaluacionmedica`
--
ALTER TABLE `evaluacionmedica`
  ADD CONSTRAINT `evaluacionmedica_ibfk_1` FOREIGN KEY (`idAdmision`) REFERENCES `admision` (`idAdmision`),
  ADD CONSTRAINT `evaluacionmedica_ibfk_2` FOREIGN KEY (`idUsuarioMedico`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD CONSTRAINT `habitacion_ibfk_1` FOREIGN KEY (`idAla`) REFERENCES `ala` (`idAla`);

--
-- Filtros para la tabla `historialcancelaciones`
--
ALTER TABLE `historialcancelaciones`
  ADD CONSTRAINT `historialcancelaciones_ibfk_1` FOREIGN KEY (`idAdmision`) REFERENCES `admision` (`idAdmision`),
  ADD CONSTRAINT `historialcancelaciones_ibfk_2` FOREIGN KEY (`usuarioCancelo`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `signosvitales`
--
ALTER TABLE `signosvitales`
  ADD CONSTRAINT `signosvitales_ibfk_1` FOREIGN KEY (`idEvaluacionEnf`) REFERENCES `evaluacionenfermeria` (`idEvaluacionEnf`);

--
-- Filtros para la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD CONSTRAINT `tratamiento_ibfk_1` FOREIGN KEY (`idEvaluacionMed`) REFERENCES `evaluacionmedica` (`idEvaluacionMed`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
