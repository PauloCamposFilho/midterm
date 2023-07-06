-- Drop and recreate Favorites table

DROP TABLE IF EXISTS favorites CASCADE;
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT favorites_unique_map_user UNIQUE (map_id, user_id)
);
