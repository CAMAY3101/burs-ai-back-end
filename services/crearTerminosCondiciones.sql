CREATE TABLE terminos_condiciones (
    id SERIAL NOT NULL,                   -- Identificador serial autoincremental
    uuid UUID NOT NULL,                   -- UUID como llave primaria
    titulo VARCHAR(255) NOT NULL,         -- Título del término (ej: "Términos de uso")
    contenido TEXT NOT NULL,              -- Contenido completo del término (texto largo)
    fecha_creacion TIMESTAMP DEFAULT NOW(), -- Fecha de creación del término
    fecha_actualizacion TIMESTAMP DEFAULT NOW(), -- Fecha de última actualización
    PRIMARY KEY (uuid)                    -- Definir uuid como llave primaria
);
