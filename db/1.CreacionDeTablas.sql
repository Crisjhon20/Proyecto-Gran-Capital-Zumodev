CREATE TABLE "RegistroDeCliente" (
    identificador INTEGER,
    usuario VARCHAR(15),
    contrasena VARCHAR(60),
    perfil VARCHAR(20)
);

CREATE TABLE habitacion (
    id_habitacion INTEGER,
    cama VARCHAR(20),
    precio NUMERIC(10, 2),
    disponibilidad VARCHAR(20),
    frigobar VARCHAR(2),
    aire_acondicionado VARCHAR(2),
    televisor VARCHAR(2),
    bano_privado VARCHAR(2)
);

CREATE TABLE reserva (
    id_reserva INTEGER,
    cliente_id INTEGER,
    habitacion_id INTEGER,
    fecha_entrada DATE,
    fecha_salida DATE,
    estado VARCHAR(20),
    fecha_creacion TIMESTAMP,
    fecha_cancelacion TIMESTAMP
);

CREATE TABLE revoked_tokens (
    id INTEGER,
    jti VARCHAR(100),
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP
);
