create schema pixlcrypt;
create schema pixlcrypt_private;

create table pixlcrypt.user (
  id    serial primary key,
  name  text not null check (char_length(name) < 120),
  updated_at    timestamp default now(),
  created_at    timestamp default now()
);

comment on table pixlcrypt.user is 'A pixlcrypt user.';
comment on column pixlcrypt.user.id is 'The primary key for the user.';
comment on column pixlcrypt.user.name is 'The name of the user.';
comment on column pixlcrypt.user.created_at is 'The time the user was last updated.';
comment on column pixlcrypt.user.created_at is 'The time the user was created.';

create type pixlcrypt.content_type as enum (
  'photo',
  'video',
  'other'
);

create table pixlcrypt.item (
  id    serial primary key,
  path  text not null,
  description text check (char_length(description) < 2000),
  content_type  pixlcrypt.content_type,
  updated_at    timestamp default now(),
  created_at    timestamp default now()
);

comment on table pixlcrypt.item is 'A pixlcrypt item.';
comment on column pixlcrypt.item.id is 'The primary key for the item.';
comment on column pixlcrypt.item.path is 'The path to the content.';
comment on column pixlcrypt.item.description is 'The description of the item.';
comment on column pixlcrypt.item.content_type is 'The content type of the item.';
comment on column pixlcrypt.item.updated_at is 'The time the user was last updated.';
comment on column pixlcrypt.item.created_at is 'The time the item was created.';

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
