-- Primero, actualizar cualquier registro existente que tenga 'Mixto' a 'Masculino' (o puedes elegir 'Femenino')
UPDATE teams SET category = 'Masculino' WHERE category = 'Mixto';
UPDATE matches SET category = 'Masculino' WHERE category = 'Mixto';

-- Crear un nuevo enum sin 'Mixto'
CREATE TYPE category_type_new AS ENUM ('Femenino', 'Masculino');

-- Actualizar las columnas para usar el nuevo enum
ALTER TABLE teams ALTER COLUMN category TYPE category_type_new USING category::text::category_type_new;
ALTER TABLE matches ALTER COLUMN category TYPE category_type_new USING category::text::category_type_new;

-- Eliminar el enum viejo y renombrar el nuevo
DROP TYPE category_type;
ALTER TYPE category_type_new RENAME TO category_type;