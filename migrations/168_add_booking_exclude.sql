-- File: src/migrations/168_add_booking_exclude.sql

-- Enable btree_gist extension (required for exclusion constraints)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping bookings for the same space
ALTER TABLE booking
  ADD CONSTRAINT booking_no_overlap EXCLUDE USING GIST (
    space_id WITH =,
    tsrange(start_at, end_at) WITH &&
  );