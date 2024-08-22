-- Database: dummy_test

-- DROP DATABASE IF EXISTS dummy_test;
-- Solo se ejecuta una vez este script para la creacion de la base de datos y sus entidades

CREATE DATABASE dummy_test
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Mexico.1252'
    LC_CTYPE = 'Spanish_Mexico.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(255) NOT NULL,
)

CREATE TABLE direccion (
    id_usuario INT REFERENCES usuarios(id_usuario) NOT NULL,
    id_direccion SERIAL PRIMARY KEY,
    calle VARCHAR(255),
    numero_exterior VARCHAR(10),
    numero_interior VARCHAR(10),
    colonia VARCHAR(255),
    cp VARCHAR(10),
    municipio VARCHAR(255),
    estado VARCHAR(255),
    tipo_vivienda VARCHAR(50),
);

CREATE TABLE verificacion (
    id_usuario INT REFERENCES usuarios(id_usuario) NOT NULL,
    id_verificacion SERIAL PRIMARY KEY,
    verificacion_correo BOOLEAN DEFAULT FALSE,
    verificacion_telefono BOOLEAN DEFAULT FALSE,
    verificacion_identidad BOOLEAN DEFAULT FALSE,
    verificacion_id BOOLEAN DEFAULT FALSE
);

CREATE TABLE historial (
    id_usuario INT REFERENCES usuarios(id_usuario) NOT NULL,
    id_historial SERIAL PRIMARY KEY,
    salario_mensual INT,
    ocupacion VARCHAR(255),
    industria VARCHAR(255),
    subindustria VARCHAR(255),
    pago_a_traves_de_banco BOOLEAN,
    salario_familiar INT,
    calificacion_crediticia VARCHAR(10),
    uso_prestamo VARCHAR(255)
);

INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono) VALUES ('creyesa18@gmail.com', '123456', 'Carlos', 'Reyes', 22, '1234567890');
ALTER TABLE usuarios
    ADD COLUMN contrasena VARCHAR(255) NOT NULL;