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

-- Matndan belgilangan joyga izoh. Joy pozitsiya bilan emas, matn bilan saqlanadi
-- (W3C Web Annotation TextQuoteSelector uslubi): quote + oldingi/keyingi kontekst + bo'lim.
create table if not exists lesson_feedback (
  id           bigint generated always as identity primary key,
  course       text        not null,
  lesson       integer     not null,
  kind         text        not null check (kind in ('wrong', 'unclear', 'typo', 'suggestion')),
  quote        text        not null check (char_length(quote) between 1 and 500),
  prefix       text        not null default '' check (char_length(prefix) <= 64),
  suffix       text        not null default '' check (char_length(suffix) <= 64),
  section      text        check (char_length(section) <= 200),
  comment      text        check (char_length(comment) <= 1000),
  lesson_hash  text        not null,
  status       text        not null default 'new' check (status in ('new', 'fixed', 'rejected')),
  device_id    uuid        not null,
  ip_hash      text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists lesson_feedback_status on lesson_feedback (status, course, lesson);
create index if not exists lesson_feedback_ip_recent on lesson_feedback (ip_hash, created_at);
