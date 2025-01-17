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

CREATE TABLE client (
    id_client SERIAL,
    uuid_client UUID NOT NULL UNIQUE PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    edad INTEGER NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    etapa_registro VARCHAR(255) NOT NULL
);

CREATE TABLE direction (
    id_direction SERIAL,
    uuid_direction UUID NOT NULL UNIQUE PRIMARY KEY,
    uuid_client UUID REFERENCES client(uuid_client) NOT NULL UNIQUE,
    calle VARCHAR(255),
    numero_exterior VARCHAR(10),
    numero_interior VARCHAR(10),
    colonia VARCHAR(255),
    cp VARCHAR(10),
    municipio VARCHAR(255),
    estado VARCHAR(255),
    tipo_vivienda VARCHAR(50)
);

CREATE TABLE verification (
    id_verification SERIAL,
    uuid_verification UUID NOT NULL UNIQUE PRIMARY KEY,
    uuid_client UUID REFERENCES client(uuid_client) NOT NULL UNIQUE,
    verificacion_correo BOOLEAN DEFAULT FALSE,
    verificacion_telefono BOOLEAN DEFAULT FALSE,
    verificacion_identidad BOOLEAN DEFAULT FALSE,
    verificacion_id BOOLEAN DEFAULT FALSE
);

CREATE TABLE historial (
    id_historial SERIAL,
    uuid_historial UUID NOT NULL UNIQUE PRIMARY KEY,
    uuid_client UUID REFERENCES client(uuid_client) NOT NULL UNIQUE,
    salario_mensual INTEGER,
    ocupacion VARCHAR(255),
    industria VARCHAR(255),
    subindustria VARCHAR(255),
    pago_a_traves_de_banco BOOLEAN,
    salario_familiar INTEGER,
    calificacion_crediticia VARCHAR(10),
    uso_prestamo VARCHAR(255)
);

CREATE TABLE fad (
    id_fad SERIAL,
    uuid_fad UUID NOT NULL UNIQUE PRIMARY KEY,
    uuid_client UUID REFERENCES client(uuid_client) NOT NULL UNIQUE,
    key_fad VARCHAR(250000),
    vector_fad VARCHAR(250000),
    validationid_fad VARCHAR(250000)
);

CREATE TABLE ocr (
    id_ocr SERIAL,
    uuid_ocr UUID NOT NULL UNIQUE PRIMARY KEY,
    uuid_client UUID REFERENCES client(uuid_client) NOT NULL UNIQUE,
    address TEXT,
    address_city VARCHAR(100),
    address_line_1 TEXT,
    address_line_2 TEXT,
    address_postal_code VARCHAR(50),
    back_number VARCHAR(50),
    birth_date VARCHAR(50),
    curp VARCHAR(20),
    document_class_code VARCHAR(50),
    document_class_name VARCHAR(100),
    document_number VARCHAR(50),
    expiration_date VARCHAR(50),
    first_name VARCHAR(100),
    full_name TEXT,
    given_name VARCHAR(100),
    issue_date VARCHAR(50),
    issuing_state_code VARCHAR(50),
    issuing_state_name VARCHAR(100),
    middle_name VARCHAR(100),
    mrz VARCHAR(255),
    nationality_code VARCHAR(50),
    nationality_name VARCHAR(100),
    personal_number VARCHAR(50),
    photo TEXT,
    qr_barcode_center TEXT,
    qr_barcode_left TEXT,
    qr_barcode_right TEXT,
    registration_date VARCHAR(40),
    registration_number VARCHAR(50),
    registration_year VARCHAR(10),
    registration_year_and_verification_number VARCHAR(10),
    sex VARCHAR(50),
    signature TEXT,
    surname VARCHAR(500),
    verification_number VARCHAR(50)
);


INSERT INTO usuarios (correo, contrasena, nombre, apellidos, edad, telefono) VALUES ('creyesa18@gmail.com', '123456', 'Carlos', 'Reyes', 22, '1234567890');
ALTER TABLE usuarios
    ADD COLUMN contrasena VARCHAR(255) NOT NULL;