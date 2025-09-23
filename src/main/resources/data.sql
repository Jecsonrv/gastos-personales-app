-- Script de inicialización de datos para el Gestor de Compras Personales
-- Se ejecuta automáticamente al iniciar la aplicación

-- Insertar categorías predefinidas si no existen
INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Alimentación', 'Gastos relacionados con comida y bebida', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Alimentación');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Transporte', 'Gastos de movilización y transporte', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Transporte');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Entretenimiento', 'Gastos de ocio, entretenimiento y diversión', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Entretenimiento');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Salud', 'Gastos médicos y de salud', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Salud');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Educación', 'Gastos educativos y de formación', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Educación');

INSERT INTO categoria (nombre, descripcion, es_predefinida) 
SELECT 'Otros', 'Otros gastos no categorizados', true
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Otros');

-- Comentario: Los datos de ejemplo se pueden agregar aquí si se desea
-- Pero es mejor que el usuario ingrese sus propios datos

-- Ejemplo de datos de prueba (comentados por defecto)
/*
-- Ejemplo de movimientos para testing (descomentar si se desea)
INSERT INTO movimiento (descripcion, monto, fecha, tipo, categoria_id)
SELECT 'Salario mensual', 2500.00, CURRENT_TIMESTAMP, 'INGRESO', 
       (SELECT id FROM categoria WHERE nombre = 'Otros' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimiento WHERE descripcion = 'Salario mensual');

INSERT INTO movimiento (descripcion, monto, fecha, tipo, categoria_id)
SELECT 'Almuerzo restaurante', 15.50, CURRENT_TIMESTAMP, 'GASTO', 
       (SELECT id FROM categoria WHERE nombre = 'Alimentación' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimiento WHERE descripcion = 'Almuerzo restaurante');

INSERT INTO movimiento (descripcion, monto, fecha, tipo, categoria_id)
SELECT 'Pasaje bus', 0.30, CURRENT_TIMESTAMP, 'GASTO', 
       (SELECT id FROM categoria WHERE nombre = 'Transporte' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimiento WHERE descripcion = 'Pasaje bus');
*/