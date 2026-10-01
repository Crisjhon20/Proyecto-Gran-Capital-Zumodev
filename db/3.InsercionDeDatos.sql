INSERT INTO "RegistroDeCliente" (identificador, usuario, contrasena, perfil)
VALUES
    (1, 'zumodev', '$2b$08$R2o3DSJNDsOF8HEr.jbZH.mNbMHsHhWzxRjuC5lXY4qBbL/LDPIM2', 'administrador'),
    (2, 'cliente1', '$2b$08$eE/.KqVyRSj1FTNfslqqQ.78kF24HIlHKi1qNKKT8hiLHJJn01I8.', 'cliente');

INSERT INTO habitacion (
    id_habitacion,
    cama,
    precio,
    disponibilidad,
    frigobar,
    aire_acondicionado,
    televisor,
    bano_privado
)
VALUES
    (1, 'individual', 35.00, 'disponible', 'no', 'no', 'si', 'si'),
    (2, 'individual', 40.00, 'disponible', 'si', 'no', 'si', 'si'),
    (3, 'doble', 60.00, 'disponible', 'si', 'si', 'si', 'si'),
    (4, 'doble', 65.00, 'no disponible', 'si', 'si', 'si', 'si'),
    (5, 'matrimonial', 75.00, 'disponible', 'si', 'si', 'si', 'si'),
    (6, 'matrimonial', 85.00, 'disponible', 'si', 'si', 'no', 'si'),
    (7, 'king', 120.00, 'disponible', 'si', 'si', 'si', 'si'),
    (8, 'king', 135.00, 'no disponible', 'si', 'si', 'si', 'si'),
    (9, 'doble', 70.00, 'disponible', 'no', 'si', 'si', 'no'),
    (10, 'individual', 45.00, 'disponible', 'no', 'si', 'no', 'si');

INSERT INTO reserva (
    id_reserva,
    cliente_id,
    habitacion_id,
    fecha_entrada,
    fecha_salida,
    estado
)
VALUES
    (1, 2, 1, '2026-10-10', '2026-10-12', 'confirmada'),
    (2, 2, 5, '2026-11-01', '2026-11-04', 'confirmada');
