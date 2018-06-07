import psycopg2
import os

def connect():
    host = os.environ['PGHOST']
    name = os.environ['PGDATABASE']
    user = os.environ['PGUSER']
    password = os.environ['PGPASSWORD']
    port = 5432
    cs = 'dbname=%s user=%s password=%s host=%s port=%s' % (name, user, password, host, port)
    return psycopg2.connect(cs)

def commit_close(conn, cur=None):
    conn.commit()
    if cur:
        cur.close()

    conn.close()

def get_user_id(email):
    conn = connect()
    cur = conn.cursor()
    cur.execute("select id from pixlcrypt.user where email='" + email + "';")
    id = str(cur.fetchone()[0])
    commit_close(conn, cur)
    return id

def insert_item(src, mime, content_type, user_id):
    conn = connect()
    cur = conn.cursor()
    cur.execute("insert into pixlcrypt.item(src, mime, content_type, user_id) values('" + src + "','" + mime + "','" + content_type + "','" + str(user_id) + "') returning id;")
    id = cur.fetchone()[0]
    commit_close(conn, cur)
    return id

def insert_thumb(src, width, height, item_id):
    conn = connect()
    cur = conn.cursor()
    cur.execute("insert into pixlcrypt.thumb(src, width, height, item_id) values('" + src + "','" + str(width) + "','" + str(height) + "','" + str(item_id) + "') returning id;")
    id = cur.fetchone()[0]
    commit_close(conn, cur)
    return id

def main():
    user_id = get_user_id('pixlcrypt@gmail.com')
    item_id = insert_item(src, 'image/jpeg', 'photo', user_id)
    insert_thumb(thumb_src, width, height, item_id)

if __name__ == '__main__':
    main()
