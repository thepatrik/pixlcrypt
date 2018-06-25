import psycopg2
import os

def _connect():
    host = os.environ['PGHOST']
    name = os.environ['PGDATABASE']
    user = os.environ['PGUSER']
    password = os.environ['PGPASSWORD']
    port = 5432
    cs = 'dbname=%s user=%s password=%s host=%s port=%s' % (name, user, password, host, port)
    return psycopg2.connect(cs)

def _commit_close(conn, cur=None):
    conn.commit()
    if cur:
        cur.close()

def get_user_id(email):
    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute("select id from pixlcrypt.user where email='" + email + "';")
        id = str(cur.fetchone()[0])
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id

def insert_item(src, mime, content_type, user_id, date):
    conn = _connect()
    try:
        cur = conn.cursor()
        if date is not None:
            cur.execute("insert into pixlcrypt.item(src, mime, content_type, user_id, created_at) values('" + src + "','" + mime + "','" + content_type + "','" + str(user_id) + "',to_timestamp(" + str(date) + ")) returning id;")
        else:
            cur.execute("insert into pixlcrypt.item(src, mime, content_type, user_id) values('" + src + "','" + mime + "','" + content_type + "','" + str(user_id) + "') returning id;")

        id = cur.fetchone()[0]
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id

def insert_thumb(src, width, height, item_id):
    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute("insert into pixlcrypt.thumb(src, width, height, item_id) values('" + src + "','" + str(width) + "','" + str(height) + "','" + str(item_id) + "') returning id;")
        id = cur.fetchone()[0]
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id
