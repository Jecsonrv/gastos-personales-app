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

-- Tabla de usuarios para Fine - Gestión de Finanzas Personales
CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Se almacenará encriptado
    nombre_completo VARCHAR(150) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    es_predefinida BOOLEAN NOT NULL DEFAULT FALSE,
    usuario_id BIGINT, -- NULL para categorías predefinidas del sistema
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movimiento (
    id BIGSERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('INGRESO', 'GASTO')),
    fecha DATE NOT NULL,
    categoria_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL, -- Cada movimiento pertenece a un usuario
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Cambiar el propietario de las tablas al usuario gastos_user
ALTER TABLE usuario OWNER TO gastos_user;
ALTER TABLE categoria OWNER TO gastos_user;
ALTER TABLE movimiento OWNER TO gastos_user;

-- Cambiar el propietario de las secuencias
ALTER SEQUENCE usuario_id_seq OWNER TO gastos_user;
ALTER SEQUENCE categoria_id_seq OWNER TO gastos_user;
ALTER SEQUENCE movimiento_id_seq OWNER TO gastos_user;

-- Insertar usuario de prueba (contraseña: admin123)
INSERT INTO usuario (username, email, password, nombre_completo) 
VALUES 
    ('admin', 'admin@fine.app', '$2a$10$K9w2Q8l5m3n1P7r5t9u1SeSvI5W7X3Y1Z4A2B6C8D0E2F4G6H8J0L2', 'Administrador Fine'),
    ('demo', 'demo@fine.app', '$2a$10$K9w2Q8l5m3n1P7r5t9u1SeSvI5W7X3Y1Z4A2B6C8D0E2F4G6H8J0L2', 'Usuario Demo')
ON CONFLICT (username) DO NOTHING;

-- Insertar datos predefinidos de categorías (sin usuario_id para que sean globales)
INSERT INTO categoria (nombre, descripcion, es_predefinida, usuario_id) 
VALUES 
    ('Alimentación', 'Gastos relacionados con comida y bebida', true, NULL),
    ('Transporte', 'Gastos de movilización y combustible', true, NULL),
    ('Salud', 'Gastos médicos y farmacéuticos', true, NULL),
    ('Educación', 'Gastos educativos y capacitación', true, NULL),
    ('Entretenimiento', 'Gastos de ocio y diversión', true, NULL),
    ('Servicios', 'Servicios básicos como luz, agua, internet', true, NULL),
    ('Ropa', 'Gastos en vestimenta y calzado', true, NULL),
    ('Hogar', 'Gastos del hogar y decoración', true, NULL),
    ('Tecnología', 'Gastos en dispositivos y software', true, NULL),
    ('Otros', 'Gastos diversos no categorizados', true, NULL),
    ('Salario', 'Ingresos por trabajo', true, NULL),
    ('Inversiones', 'Ingresos por inversiones', true, NULL),
    ('Negocios', 'Ingresos por actividades comerciales', true, NULL),
    ('Regalos', 'Ingresos por regalos recibidos', true, NULL),
    ('Otros Ingresos', 'Otros tipos de ingresos', true, NULL)
ON CONFLICT (nombre) DO NOTHING;

-- Verificar que todo está correcto
SELECT 'Tablas creadas correctamente' as mensaje;
SELECT count(*) as total_usuarios FROM usuario;
SELECT count(*) as total_categorias FROM categoria;

-- Mostrar usuarios creados
SELECT username, email, nombre_completo, activo FROM usuario;