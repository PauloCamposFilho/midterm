-- Drop and recreate Editors table

DROP TABLE IF EXISTS editors CASCADE;
CREATE TABLE editors (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT editors_unique_map_user UNIQUE (map_id, user_id)
);
