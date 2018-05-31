create role pixlcrypt_postgraphile login password 'SuperSecret1234!';

create role pixlcrypt_user;
grant pixlcrypt_user to pixlcrypt_postgraphile;

grant usage on schema pixlcrypt to pixlcrypt_user;

grant select on table pixlcrypt.user to pixlcrypt_user;
grant update, delete on table pixlcrypt.user to pixlcrypt_user;
grant usage on sequence pixlcrypt.user_id_seq to pixlcrypt_user;

grant select on table pixlcrypt.item to pixlcrypt_user;
grant insert, update, delete on table pixlcrypt.item to pixlcrypt_user;
grant usage on sequence pixlcrypt.item_id_seq to pixlcrypt_user;

grant select on table pixlcrypt.tag to pixlcrypt_user;
grant insert, update, delete on table pixlcrypt.tag to pixlcrypt_user;
grant usage on sequence pixlcrypt.tag_id_seq to pixlcrypt_user;

grant select on table pixlcrypt.item_tag to pixlcrypt_user;
grant insert, update, delete on table pixlcrypt.item_tag to pixlcrypt_user;

grant select on table pixlcrypt.thumb to pixlcrypt_user;
grant insert, update, delete on table pixlcrypt.thumb to pixlcrypt_user;
grant usage on sequence pixlcrypt.thumb_id_seq to pixlcrypt_user;


grant execute on function pixlcrypt.current_user() to pixlcrypt_user;
grant execute on function pixlcrypt_private.set_updated_at() to pixlcrypt_user;

-- User policies

create policy select_user on pixlcrypt.user for select to pixlcrypt_user
  using (email = current_setting('jwt.claims.email'));

create policy insert_user on pixlcrypt.user for insert to pixlcrypt_user
  with check (email = current_setting('jwt.claims.email'));

create policy update_user on pixlcrypt.user for update to pixlcrypt_user
  using (email = current_setting('jwt.claims.email'));

create policy delete_user on pixlcrypt.user for delete to pixlcrypt_user
  using (email = current_setting('jwt.claims.email'));

-- Item policies

create policy select_item on pixlcrypt.item for select to pixlcrypt_user
  using (user_id = (select id from pixlcrypt.user where email = current_setting('jwt.claims.email')));

create policy insert_item on pixlcrypt.item for insert to pixlcrypt_user
  with check (user_id = (select id from pixlcrypt.user where email = current_setting('jwt.claims.email')));

create policy update_item on pixlcrypt.item for update to pixlcrypt_user
  using (user_id = (select id from pixlcrypt.user where email = current_setting('jwt.claims.email')));

create policy delete_item on pixlcrypt.item for delete to pixlcrypt_user
  using (user_id = (select id from pixlcrypt.user where email = current_setting('jwt.claims.email')));

-- Tag policies
create policy select_tag on pixlcrypt.tag for select to pixlcrypt_user
  using (user_id = (select id from pixlcrypt.user where email = current_setting('jwt.claims.email')));

-- Item-tag policies
create policy select_tag_item on pixlcrypt.item_tag for select
  using (true);

-- Thumb policies TODO: Look at policy!
create policy select_thumb on pixlcrypt.thumb for select to pixlcrypt_user
  using (true);
