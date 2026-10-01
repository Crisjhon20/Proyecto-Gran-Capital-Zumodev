ALTER TABLE "RegistroDeCliente"
    ADD CONSTRAINT pk_registro_de_cliente
    PRIMARY KEY (identificador);

ALTER TABLE habitacion
    ADD CONSTRAINT pk_habitacion
    PRIMARY KEY (id_habitacion);

ALTER TABLE "RegistroDeCliente"
    ALTER COLUMN identificador SET NOT NULL,
    ALTER COLUMN usuario SET NOT NULL,
    ALTER COLUMN contrasena SET NOT NULL,
    ALTER COLUMN perfil SET NOT NULL;

ALTER TABLE habitacion
    ALTER COLUMN id_habitacion SET NOT NULL,
    ALTER COLUMN cama SET NOT NULL,
    ALTER COLUMN precio SET NOT NULL,
    ALTER COLUMN disponibilidad SET NOT NULL,
    ALTER COLUMN frigobar SET NOT NULL,
    ALTER COLUMN aire_acondicionado SET NOT NULL,
    ALTER COLUMN televisor SET NOT NULL,
    ALTER COLUMN bano_privado SET NOT NULL;

ALTER TABLE reserva
    ADD CONSTRAINT pk_reserva
    PRIMARY KEY (id_reserva);

ALTER TABLE reserva
    ALTER COLUMN id_reserva SET NOT NULL,
    ALTER COLUMN cliente_id SET NOT NULL,
    ALTER COLUMN habitacion_id SET NOT NULL,
    ALTER COLUMN fecha_entrada SET NOT NULL,
    ALTER COLUMN fecha_salida SET NOT NULL,
    ALTER COLUMN estado SET NOT NULL,
    ALTER COLUMN fecha_creacion SET NOT NULL;

ALTER TABLE revoked_tokens
    ADD CONSTRAINT pk_revoked_tokens
    PRIMARY KEY (id);

ALTER TABLE revoked_tokens
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN jti SET NOT NULL,
    ALTER COLUMN expires_at SET NOT NULL,
    ALTER COLUMN revoked_at SET NOT NULL;

ALTER TABLE "RegistroDeCliente"
    ADD CONSTRAINT uq_registro_de_cliente_usuario
    UNIQUE (usuario);

ALTER TABLE "RegistroDeCliente"
    ADD CONSTRAINT chk_registro_de_cliente_usuario_no_vacio
    CHECK (char_length(usuario) BETWEEN 1 AND 15);

ALTER TABLE "RegistroDeCliente"
    ADD CONSTRAINT chk_registro_de_cliente_contrasena
    CHECK (char_length(contrasena) = 60
           AND contrasena ~ '^\$2[aby]\$08\$[./A-Za-z0-9]{53}$');

ALTER TABLE "RegistroDeCliente"
    ADD CONSTRAINT chk_registro_de_cliente_perfil
    CHECK (perfil IN ('administrador', 'cliente'));

ALTER TABLE "RegistroDeCliente"
    ALTER COLUMN perfil SET DEFAULT 'cliente';

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_cama
    CHECK (cama IN ('individual', 'doble', 'matrimonial', 'king'));

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_precio
    CHECK (precio > 0);

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_disponibilidad
    CHECK (disponibilidad IN ('disponible', 'no disponible'));

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_frigobar
    CHECK (frigobar IN ('si', 'no'));

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_aire_acondicionado
    CHECK (aire_acondicionado IN ('si', 'no'));

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_televisor
    CHECK (televisor IN ('si', 'no'));

ALTER TABLE habitacion
    ADD CONSTRAINT chk_habitacion_bano_privado
    CHECK (bano_privado IN ('si', 'no'));

ALTER TABLE habitacion
    ALTER COLUMN disponibilidad SET DEFAULT 'disponible',
    ALTER COLUMN frigobar SET DEFAULT 'no',
    ALTER COLUMN aire_acondicionado SET DEFAULT 'no',
    ALTER COLUMN televisor SET DEFAULT 'no',
    ALTER COLUMN bano_privado SET DEFAULT 'no';

ALTER TABLE reserva
    ADD CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES "RegistroDeCliente" (identificador);

ALTER TABLE reserva
    ADD CONSTRAINT fk_reserva_habitacion
    FOREIGN KEY (habitacion_id)
    REFERENCES habitacion (id_habitacion);

ALTER TABLE reserva
    ADD CONSTRAINT chk_reserva_fechas
    CHECK (fecha_entrada < fecha_salida);

ALTER TABLE reserva
    ADD CONSTRAINT chk_reserva_estado
    CHECK (estado IN ('confirmada', 'cancelada', 'completada'));

ALTER TABLE reserva
    ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE revoked_tokens
    ADD CONSTRAINT uq_revoked_tokens_jti
    UNIQUE (jti);

ALTER TABLE revoked_tokens
    ALTER COLUMN revoked_at SET DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX idx_reserva_cliente ON reserva (cliente_id);
CREATE INDEX idx_reserva_habitacion_fechas
    ON reserva (habitacion_id, fecha_entrada, fecha_salida);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens (expires_at);

CREATE VIEW "ListarHabitacionesPorFiltro" AS
SELECT
    cama,
    precio,
    disponibilidad
FROM habitacion;
