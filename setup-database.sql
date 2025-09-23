-- Script para configurar la base de datos y permisos
-- Ejecutar como usuario administrador (postgres)

-- Conectar a la base de datos gastos_personales
\c gastos_personales;

-- Otorgar permisos completos al usuario gastos_user en el esquema public
GRANT ALL PRIVILEGES ON SCHEMA public TO gastos_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gastos_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gastos_user;

-- Otorgar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO gastos_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO gastos_user;

-- Crear las tablas si no existen (ejecutar como postgres)
CREATE TABLE IF NOT EXISTS categoria (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    es_predefinida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimiento (
    id BIGSERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('INGRESO', 'GASTO')),
    fecha DATE NOT NULL,
    categoria_id BIGINT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Cambiar el propietario de las tablas al usuario gastos_user
ALTER TABLE categoria OWNER TO gastos_user;
ALTER TABLE movimiento OWNER TO gastos_user;

-- Cambiar el propietario de las secuencias
ALTER SEQUENCE categoria_id_seq OWNER TO gastos_user;
ALTER SEQUENCE movimiento_id_seq OWNER TO gastos_user;

-- Insertar datos predefinidos
INSERT INTO categoria (nombre, descripcion, es_predefinida) 
VALUES 
    ('Alimentación', 'Gastos relacionados con comida y bebida', true),
    ('Transporte', 'Gastos de movilización y combustible', true),
    ('Salud', 'Gastos médicos y farmacéuticos', true),
    ('Educación', 'Gastos educativos y capacitación', true),
    ('Entretenimiento', 'Gastos de ocio y diversión', true),
    ('Servicios', 'Servicios básicos como luz, agua, internet', true),
    ('Ropa', 'Gastos en vestimenta y calzado', true),
    ('Hogar', 'Gastos del hogar y decoración', true),
    ('Tecnología', 'Gastos en dispositivos y software', true),
    ('Otros', 'Gastos diversos no categorizados', true),
    ('Salario', 'Ingresos por trabajo', true),
    ('Inversiones', 'Ingresos por inversiones', true),
    ('Negocios', 'Ingresos por actividades comerciales', true),
    ('Regalos', 'Ingresos por regalos recibidos', true),
    ('Otros Ingresos', 'Otros tipos de ingresos', true)
ON CONFLICT (nombre) DO NOTHING;

-- Verificar que todo está correcto
SELECT 'Tablas creadas correctamente' as mensaje;
SELECT count(*) as total_categorias FROM categoria;