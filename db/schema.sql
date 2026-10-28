-- Idempotent sxema: har build'da (DATABASE_URL bo'lsa) scripts/migrate.ts ishga tushiradi.

-- Dars oxiridagi baho. Bitta qurilma bitta darsga bitta baho beradi, keyin o'zgartirishi mumkin.
create table if not exists lesson_rating (
  course      text        not null,
  lesson      integer     not null,
  device_id   uuid        not null,
  stars       smallint    not null check (stars between 1 and 5),
  tags        text[]      not null default '{}',
  comment     text        check (char_length(comment) <= 1000),
  ip_hash     text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (course, lesson, device_id)
);

create index if not exists lesson_rating_ip_recent on lesson_rating (ip_hash, updated_at);
