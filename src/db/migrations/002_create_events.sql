CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  at TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  capacity INT CHECK (capacity > 0 AND capacity <= 1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS registrations_event_idx ON registrations(event_id);
