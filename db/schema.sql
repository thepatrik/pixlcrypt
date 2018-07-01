create schema if not exists pixlcrypt;
create schema if not exists pixlcrypt_private;

create type pixlcrypt.jwt_token as (
  email text,
  role text
);

create table pixlcrypt.user (
  id    serial primary key,
  username  text not null check (char_length(username) < 120) UNIQUE,
  email  text not null check (char_length(email) < 120) UNIQUE,
  name  text not null check (char_length(name) < 120),
  updated_at    timestamp default now(),
  created_at    timestamp default now()
);

comment on table pixlcrypt.user is 'A pixlcrypt user.';
comment on column pixlcrypt.user.id is 'The primary key for the user.';
comment on column pixlcrypt.user.name is 'The name of the user.';
comment on column pixlcrypt.user.updated_at is 'The time the user was last updated.';
comment on column pixlcrypt.user.created_at is 'The time the user was created.';

create function pixlcrypt.current_user() returns pixlcrypt.user as $$
  select *
  from pixlcrypt.user
  where email = current_setting('jwt.claims.email')
$$ language sql stable;

comment on function pixlcrypt.current_user() is 'Gets the user who was identified by our JWT.';

create type pixlcrypt.content_type as enum (
  'photo',
  'video',
  'other'
);

create table pixlcrypt.item (
  id    serial primary key,
  src  text not null,
  caption text check (char_length(caption) < 100),
  description text check (char_length(description) < 2000),
  mime text,
  content_type  pixlcrypt.content_type,
  orientation integer,
  user_id integer not null references pixlcrypt.user (id),
  updated_at    timestamp default now(),
  created_at    timestamp default now()
);

create table pixlcrypt.tag (
  id  serial primary key,
  key text NOT NULL,
  val text NOT NULL,
  user_id integer not null references pixlcrypt.user(id)
);

comment on table pixlcrypt.item is 'A pixlcrypt item.';
comment on column pixlcrypt.item.id is 'The primary key for the item.';
comment on column pixlcrypt.item.src is 'The source path to original content.';
comment on column pixlcrypt.item.caption is 'The item caption.';
comment on column pixlcrypt.item.description is 'The description of the item.';
comment on column pixlcrypt.item.mime is 'The MIME type of the item.';
comment on column pixlcrypt.item.content_type is 'The content type of the item.';
comment on column pixlcrypt.item.user_id is 'The user id for the item.';
comment on column pixlcrypt.item.updated_at is 'The time the user was last updated.';
comment on column pixlcrypt.item.created_at is 'The time the item was created.';

create table pixlcrypt.item_tag (
  item_id integer not null references pixlcrypt.item(id) on delete cascade,
  tag_id integer not null references pixlcrypt.tag(id) on delete cascade,
  primary key(item_id, tag_id)
);

create table pixlcrypt.thumb (
  id  serial primary key,
  src text NOT NULL,
  width integer,
  height integer,
  item_id integer references pixlcrypt.item(id) on delete cascade
);

create function pixlcrypt_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger user_updated_at before update
  on pixlcrypt.user
  for each row
  execute procedure pixlcrypt_private.set_updated_at();

create trigger item_updated_at before update
  on pixlcrypt.item
  for each row
  execute procedure pixlcrypt_private.set_updated_at();

alter table pixlcrypt.user enable row level security;
alter table pixlcrypt.item enable row level security;
alter table pixlcrypt.tag enable row level security;
alter table pixlcrypt.thumb enable row level security;
alter table pixlcrypt.item_tag enable row level security;

alter default privileges revoke execute on functions from public;
