
-- Crear tabla Roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_rol`)
);

insert into roles (nombre_rol) values ("Estudiante");
insert into roles (nombre_rol) values ("Profesor");
 
-- Crear tabla Usuarios con contraseñas seguras y restricciones adicionales
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `contraseña` VARCHAR(255) NOT NULL,
  `cedula` VARCHAR(45) NOT NULL,
  `roles_id_rol` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  FOREIGN KEY (`roles_id_rol`)
    REFERENCES `roles` (`id_rol`),
  INDEX idx_nombre_usuario (`nombre`)
);

-- Crear tabla Cursos
CREATE TABLE IF NOT EXISTS `cursos` (
  `id_curso` INT NOT NULL AUTO_INCREMENT,
  `nombre_curso` VARCHAR(45) NOT NULL,
  `descripcion_curso` VARCHAR(45) NOT NULL,
  `contenido_curso` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_curso`)
);
-- Crear tabla Modulos
CREATE TABLE IF NOT EXISTS `modulos` (
  `id_modulo` INT NOT NULL AUTO_INCREMENT,
  `nombre_modulo` VARCHAR(45) NOT NULL,
  `contenido_modulo` VARCHAR(45) NOT NULL,
  `descripcion_modulo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_modulo`)
);
-- Crear tabla Biblioteca
CREATE TABLE IF NOT EXISTS `biblioteca` (
  `id_biblioteca` INT NOT NULL AUTO_INCREMENT,
  `nombre_biblioteca` VARCHAR(45) NOT NULL,
  `contenido_biblioteca` VARCHAR(45) NOT NULL,
  `descripcion_biblioteca` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_biblioteca`)
);
-- Crear tabla Quiz
CREATE TABLE IF NOT EXISTS `quiz` (
  `id_quiz` INT NOT NULL AUTO_INCREMENT,
  `nombre_quiz` VARCHAR(45) NOT NULL,
  `descripcion_quiz` VARCHAR(45) NOT NULL,
  `calificacion_quiz` VARCHAR(45) NOT NULL,
  `actividad_quiz` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_quiz`)
);
-- Crear tabla Foro
CREATE TABLE IF NOT EXISTS `foro` (
  `id_foro` INT NOT NULL AUTO_INCREMENT,
  `nombre_foro` VARCHAR(45) NOT NULL,
  `descripcion_foro` VARCHAR(45) NOT NULL,
  `respuesta_foro` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_foro`)
);
-- Crear tabla Categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `tipo_categoria` VARCHAR(45) NOT NULL,
  `cursos_id_curso` INT NOT NULL,
  `foro_id_foro` INT NOT NULL,
  PRIMARY KEY (`id_categoria`),
      FOREIGN KEY (`cursos_id_curso`)
    REFERENCES `cursos` (`id_curso`),
	FOREIGN KEY (`foro_id_foro`)
    REFERENCES `foro` (`id_foro`)
);
-- Crear tabla Detalle_Curso con nombres consistentes
CREATE TABLE IF NOT EXISTS `detalle_cursos` (
  `id_detalle_curso` INT NOT NULL AUTO_INCREMENT,
  `quiz_id_quiz` INT NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  `modulos_id_modulo` INT NOT NULL,
  `cursos_id_curso` INT NOT NULL,
  PRIMARY KEY (`id_detalle_curso`),
  FOREIGN KEY (`quiz_id_quiz`)
    REFERENCES `quiz` (`id_quiz`),
  FOREIGN KEY (`usuarios_id_usuario`)
    REFERENCES `usuarios` (`id_usuario`),
  FOREIGN KEY (`modulos_id_modulo`)
    REFERENCES `modulos` (`id_modulo`),
  FOREIGN KEY (`cursos_id_curso`)
    REFERENCES `cursos` (`id_curso`)
);

-- Crear tabla Detalle_Contenido con nombres consistentes
CREATE TABLE IF NOT EXISTS `detalle_contenidos` (
  `id_detalle_contenido` INT NOT NULL AUTO_INCREMENT,
  `biblioteca_id_biblioteca` INT NOT NULL,
  `modulos_id_modulo` INT NOT NULL,
  PRIMARY KEY (`id_detalle_contenido`),
  FOREIGN KEY (`biblioteca_id_biblioteca`)
    REFERENCES `biblioteca` (`id_biblioteca`),
  FOREIGN KEY (`modulos_id_modulo`)
    REFERENCES `modulos` (`id_modulo`)
);