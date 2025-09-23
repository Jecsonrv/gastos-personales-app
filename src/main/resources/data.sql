-- Script de inicialización de datos para el Gestor de Compras Personales
-- Se ejecuta automáticamente al iniciar la aplicación
-- Usando caracteres sin acentos para evitar problemas de codificación

-- Insertar categorías predefinidas si no existen
INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Alimentacion', 'Gastos relacionados con comida y bebida', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Alimentacion');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Transporte', 'Gastos de movilizacion y transporte', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Transporte');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Entretenimiento', 'Gastos de ocio, entretenimiento y diversion', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Entretenimiento');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Salud', 'Gastos medicos y de salud', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Salud');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Educacion', 'Gastos educativos y de formacion', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Educacion');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Servicios', 'Servicios basicos como luz, agua, internet', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Servicios');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Ropa', 'Gastos en vestimenta y calzado', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Ropa');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Hogar', 'Gastos del hogar y decoracion', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Hogar');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Tecnologia', 'Gastos en dispositivos y software', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Tecnologia');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Otros', 'Otros gastos no categorizados', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Otros');

-- Categorias para ingresos
INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Salario', 'Ingresos por trabajo', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Salario');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Inversiones', 'Ingresos por inversiones', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Inversiones');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Negocios', 'Ingresos por actividades comerciales', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Negocios');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Otros Ingresos', 'Otros tipos de ingresos', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Otros Ingresos');