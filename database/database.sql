-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: homeease_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (16,'Limpieza y mantenimiento','Cuidado profesional para mantener tu hogar limpio y ordenado.','1742327116810_servicio-limpieza-mantenimiento.jpg'),(17,'Reparaciones y mejoras','Soluciones rápidas para arreglos y renovaciones del hogar.','1742327179723_tecnicos-reparaciones-hogar-1194x535-1.webp'),(18,'Jardinería y exteriores','Cuidado y diseño para embellecer tus espacios al aire libre.','1742327232501_istockphoto-1137974374-612x612.jpg'),(19,'Cuidado de mascotas','Atención para tu mascota.','1742327270234_trabajo-de-cuidar-perros.jpg'),(20,'Seguridad y protección','Soluciones para garantizar la tranquilidad y resguardo de tu hogar.','1742327321364_proteccion.avif');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature`
--

DROP TABLE IF EXISTS `feature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `feature_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature`
--

LOCK TABLES `feature` WRITE;
/*!40000 ALTER TABLE `feature` DISABLE KEYS */;
INSERT INTO `feature` VALUES (21,'Uso de productos ecológicos y no tóxicos.','fa-leaf',40),(22,'Servicio flexible según horarios de oficina.','fa-clock-o',40),(23,'Eliminación de manchas y olores persistentes.','fa-times',41),(24,'Uso de detergentes especializados.','fa-magic',41),(25,'Secado rápido de las alfombras.','fa-clock-o',41),(26,'Limpieza y desinfección de componentes.','fa-magic',42),(27,'Recomendación de mantenimiento periódico.','fa-cogs',42),(28,'Ajuste de temperatura y eficiencia energética.','fa-thermometer-full',42),(29,'Desinfección con productos antibacterianos y viricidas.','fa-flask',43),(30,'Desinfección de superficies de alto contacto','fa-home',43),(31,'Eliminación de manchas difíciles','fa-times',44),(32,'Servicio en altura con equipos de seguridad.','fa-building',44),(33,'Limpieza interior y exterior de ventanas.','fa-magic',44),(34,'Reparación de lavadoras, refrigeradores, etc.','fa-wrench',45),(35,'Servicio a domicilio y rápido.','fa-home',45),(36,'Diagnóstico gratuito del problema.','fa-usd',45),(37,'Instalación de interruptores, enchufes y paneles eléctricos.','fa-cogs',46),(38,'Reparación y reemplazo de cableado eléctrico.','fa-wrench',46),(39,'Cumplimiento con normativas de seguridad.','fa-shield',46),(40,'Reparación de fugas de agua y drenajes obstruidos.','fa-wrench',47),(41,'Reparación de grifos, inodoros y tuberías.','fa-wrench',47),(42,'Uso de herramientas especializadas.','fa-cogs',47),(43,'Servicios rápidos y sin necesidad de cortes de agua prolongados.','fa-clock-o',47),(44,'Uso de pintura ecológica y de calidad.','fa-leaf',48),(45,'Colores personalizados y opciones de acabados mate o brillante.','fa-paint-brush',48),(46,'Reparación de goteras y filtraciones.','fa-wrench',49),(47,'Reparación y sellado de grietas y fisuras.','fa-wrench',49),(48,'Mantenimiento de techos de tejas, concreto y metal.','fa-cogs',49),(49,'Recogida de residuos y desechos del jardín.','fa-trash',50),(50,'Corte en días y horarios flexibles.','fa-clock-o',50),(51,'Corte uniforme y mantenimiento del césped.','fa-cogs',50),(52,'Diseño a medida según preferencias del cliente.','fa-picture-o',51),(53,'Selección de plantas adecuadas al clima y espacio.','fa-sun-o',51),(54,'Asesoría en el mantenimiento posterior del jardín.','fa-cogs',51),(55,'Recogida y disposición de los residuos podados.','fa-trash',52),(56,'Servicio de poda en altura con equipos de seguridad.','fa-shield',52),(57,'Mejora del crecimiento de árboles y arbustos.','fa-tree',52),(58,'Instalación de sistemas de riego por goteo o aspersión.','fa-cogs',53),(59,'Programación automática según clima y necesidades del jardín.','fa-sun-o',53),(60,'Sistemas eficientes para ahorro de agua.','fa-tint',53),(61,'Mantenimiento de sistemas de riego ya instalados.','fa-wrench',53),(62,'Limpieza de fondos, paredes y superficie de la piscina.','fa-magic',54),(63,'Revisión y mantenimiento de sistemas de filtrado.','fa-cogs',54),(64,'Comprobación y ajuste de niveles de productos químicos.','fa-flask',54),(65,'Paseos adaptados a la raza y tamaño del perro.','fa-paw',55),(66,'Recogida y entrega en el hogar.','fa-home',55),(67,'Duración de paseos de 30 a 60 minutos.','fa-clock-o',55),(68,'Alimentación y cuidados diarios según indicaciones del dueño.','fa-cutlery',56),(69,'Atención personalizada para perros, gatos y pequeños animales.','fa-paw',56),(70,'Servicio de limpieza y ejercicio para las mascotas.','fa-magic',56),(71,'Baño y corte de pelo adaptado a la raza.','fa-bath',57),(72,'Uso de productos profesionales y seguros.','fa-magic',57),(73,'Corte de uñas y limpieza de orejas.','fa-scissors',57),(74,'Sesiones personalizadas para cada perro.','fa-paw',58),(75,'Adiestramiento básico y avanzado.','fa-angle-double-up',58),(76,'Técnicas de refuerzo positivo para el aprendizaje.','fa-bolt',58),(77,'Esterilización tanto para perros como para gatos.','fa-paw',59),(78,'Procedimiento seguro y realizado por veterinarios certificados.','fa-user-md',59),(79,'Cuidado postoperatorio y seguimiento.','fa-h-square',59),(80,'Cámaras de alta resolución y visión nocturna.','fa-video-camera',60),(81,'Instalación profesional en puntos estratégicos.','fa-wrench',60),(82,'Acceso remoto a las cámaras desde móviles y PC.','fa-desktop',60),(83,'Instalación y pruebas de funcionamiento.','fa-wrench',61),(84,'Mantenimiento preventivo y actualización de sistemas.','fa-cogs',61),(85,'Alarma sonora y notificaciones al móvil.','fa-volume-up',61),(86,'Instalación profesional y garantía de calidad.','fa-wrench',63),(87,'Puertas blindadas resistentes a robos y daños.','fa-user-secret',63),(88,'Cerraduras de alta seguridad y herrajes reforzados.','fa-shield',63),(89,'Análisis de riesgos y vulnerabilidades de la propiedad.','fa-line-chart',64),(90,'Planificación y mejora de la protección general.','fa-shield',64),(91,'Recomendación de sistemas de seguridad adecuados.','fa-check',64),(92,'Instalación de detectores de humo y extintores.','fa-wrench',65),(93,'Revisión periódica y mantenimiento de sistemas.','fa-cogs',65),(94,'Capacitación en uso de extintores y medidas preventivas.','fa-fire-extinguisher',65);
/*!40000 ALTER TABLE `feature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `stock` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `available_until` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKowomku74u72o6h8q0khj7id8q` (`category_id`),
  CONSTRAINT `FKowomku74u72o6h8q0khj7id8q` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `product_chk_1` CHECK ((`stock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (40,'Servicio de limpieza profesional para oficinas, asegurando un ambiente limpio y saludable.','Limpieza de Oficinas',75,12,'/uploads/oficina-limpieza-hombres-tiro-completo_23-2149345516.avif',16,'2025-01-01','2025-12-31'),(41,'Eliminación de manchas y suciedad de alfombras con productos especializados.','Limpieza de Alfombras',50,15,'/uploads/como_limpiar_alfombras_en_casa_49658_600.jpg',16,'2025-01-01','2025-12-31'),(42,'Revisión y limpieza de sistemas de aire acondicionado para su correcto funcionamiento.',' Mantenimiento de Aire Acondicionado',80,10,'/uploads/servicio-tecnico-limpieza-aire-acondicionado-tela_35076-3620.avif',16,'2025-01-01','2025-12-31'),(43,'Servicios de desinfección de espacios comerciales y residenciales.','Desinfección de Espacios',60,18,'/uploads/desinfeccion-nebulizacion-900x600.jpg',16,'2025-01-01','2025-12-31'),(44,'Limpieza profesional de ventanas interiores y exteriores en edificios residenciales y comerciales.','Limpieza de Ventanas',40,20,'/uploads/istockphoto-1150282133-612x612.jpg',16,'2025-01-01','2025-12-31'),(45,'Reparación de electrodomésticos como lavadoras, neveras, y más.','Reparación de Electrodomésticos',90,8,'/uploads/istockphoto-518423060-612x612.jpg',17,'2025-01-01','2025-12-31'),(46,'Instalación profesional de sistemas eléctricos en viviendas y comercios.','Instalación de Sistemas Eléctricos',150,6,'/uploads/Instalacion-electrica.webp',17,'2025-01-01','2025-12-31'),(47,'Servicios de reparación de grifos, cañerías, y fugas de agua.','Reparación de Fontanería',70,10,'/uploads/istockphoto-514104433-612x612.jpg',17,'2025-01-01','2025-12-31'),(48,'Pintura de paredes y techos para renovar la apariencia de cualquier espacio.','Pintura de Interiores',120,10,'/uploads/pintor-trabajando-habitacion_1276743-531.jpg',17,'2025-01-01','2025-12-31'),(49,'Reparación de goteras y daños en techos de viviendas o comercios','Reparación de Techos',130,5,'/uploads/depositphotos_290002052-stock-photo-selective-focus-handsome-handyman-repairing.jpg',17,'2025-01-01','2025-12-31'),(50,'Servicio de corte y mantenimiento de césped para jardines privados y comerciales.','Corte de Césped',40,15,'/uploads/cesped.avif',18,'2025-01-01','2025-12-31'),(51,'Diseño personalizado de jardines con plantas, árboles y decoraciones.','Diseño de Jardines',150,7,'/uploads/D1-848x480.jpg.webp',18,'2025-01-01','2025-12-31'),(52,'Poda de árboles y arbustos para mantenerlos saludables y estéticamente agradables.','Poda de Árboles',100,10,'/uploads/arbol-poda.avif',18,'2025-01-01','2025-12-31'),(53,'Instalación de sistemas de riego automático para jardines y huertos.','Instalación de Riego Automático',180,6,'/uploads/istockphoto-1076104412-612x612.jpg',18,'2025-01-01','2025-12-31'),(54,'Limpieza y mantenimiento de piscinas, asegurando agua limpia y saludable.','Limpieza de Piscinas',80,12,'/uploads/limpieza-correcta-de-piscinas-1.jpg',18,'2025-01-01','2025-12-31'),(55,'Paseos diarios para perros, asegurando su ejercicio y bienestar.','Paseo de Perros',25,20,'/uploads/paseador.avif',19,'2025-01-01','2025-12-31'),(56,'Cuidado de mascotas en el hogar mientras sus dueños están fuera.','Cuidado de Mascotas a Domicilio',50,15,'/uploads/pet-care-while-on-vacation.jpg',19,'2025-01-01','2025-12-31'),(57,'Corte y baño profesional para perros y gatos.','Peluquería Canina',40,10,'/uploads/5beba38a04cf8db03153284efcacd354.png',19,'2025-01-01','2025-12-31'),(58,'Sesiones de adiestramiento para mejorar el comportamiento de perros.','Adiestramiento de Perros',80,8,'/uploads/BGEHeEA.jpg',19,'2025-01-01','2025-12-31'),(59,'Servicio de esterilización para mascotas, tanto perros como gatos.','Esterilización de Mascotas',100,5,'/uploads/purina-consulta-veterinaria-para-mascotas-lo-que-debes-saber.avif',19,'2025-01-01','2025-12-31'),(60,'Instalación de cámaras de vigilancia para mejorar la seguridad del hogar o negocio.','Instalación de Cámaras de Seguridad',200,10,'/uploads/porque-instalar-camaras-de-seguridad_800x534.webp',20,'2025-01-01','2025-12-31'),(61,'Instalación de sistemas de alarma para prevenir robos y entradas no autorizadas.','Sistemas de Alarma',150,12,'/uploads/instala-300x200.jpg',20,'2025-01-01','2025-12-31'),(63,'Refuerzo de puertas para mayor seguridad en viviendas y comercios.','Blindaje de Puertas',250,5,'/uploads/b4de3a304ae9178ed2b4ccdb25b20676.jpg',20,'2025-01-01','2025-12-31'),(64,'Consultoría para mejorar la seguridad del hogar o empresa.','Asesoramiento en Seguridad',80,15,'/uploads/LFBMS033.jpg',20,'2025-01-01','2025-12-31'),(65,'Instalación de sistemas de protección contra incendios y capacitación en su uso.','Protección contra Incendios',300,6,'/uploads/proteccion_activa.webp',20,'2025-01-01','2025-12-31');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rating_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorites`
--

LOCK TABLES `user_favorites` WRITE;
/*!40000 ALTER TABLE `user_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ramiro','Cafferata','ramicafferata@gmail.com','$2a$10$Yg8ZY2zw2cWsxqo6moBIa.REzytyFLGs12r5EcYBp9.qTYG.NPcNO',_binary ''),(2,'urco','solomun','ramaratax@gmail.com','$2a$10$6esn.yveXP2sJa7ABl0rheGL4.6taMy6u0Dak9uYXo54pK9xkuZQW',_binary '\0'),(3,'sam','chispas','ramirocafferata04@gmail.com','$2a$10$Ld5j1oQdtE/4M2eVYEu21u/OPbo1vrfZOp/xg4Qq2zkiIS4.rtkJq',_binary '\0'),(4,'m','c','moco@gmail.com','$2a$10$nFgzgj62e3p5/0vtqNLtkeD.UCVqp8dsIFBand26ZV3/LpV1xEVfG',_binary '\0'),(5,'martin','soto','rcafferata@gmail.com','$2a$10$qrvcggSqU.llnSN.5cZzeOr.yJoNizOuANKQyEczbWtzftouHRL.u',_binary '\0'),(6,'ferland','mendy','ferland@gmail.com','$2a$10$w4yaaUzM8CN6gZPMcaGx4eYOAYx/zSwUw89raNtw6cW2zBuwX9xMK',_binary '\0'),(7,'ludo','vico','ludo@gmail.com','$2a$10$h.PqYxBSxo51Um.ng20WNehcyekGDMGDKq.FeTQaFPt9DITWQwcLG',_binary '');
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

-- Dump completed on 2025-05-14 11:17:14
