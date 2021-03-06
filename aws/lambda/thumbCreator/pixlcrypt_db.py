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
    id = None
    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute("select id from pixlcrypt.user where email='" + email + "';")
        res = cur.fetchone()
        if res is not None:
            id = str(res[0])
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id

def insert_item(src, mime, orientation, content_type, user_id, date):
    id = None
    conn = _connect()
    try:
        cur = conn.cursor()
        if date is not None:
            cur.execute('insert into pixlcrypt.item(src, mime, orientation, content_type, user_id, created_at) values(%s, %s, %s, %s, %s, to_timestamp(%s)) returning id;', (src, mime, orientation, content_type, user_id, date))
        else:
            cur.execute('insert into pixlcrypt.item(src, mime, orientation, content_type, user_id) values(%s, %s, %s, %s, %s) returning id;', (src, mime, orientation, content_type, user_id))

        res = cur.fetchone()
        if res is not None:
            id = res[0]
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id

def insert_thumb(src, width, height, item_id):
    id = None
    conn = _connect()
    try:
        cur = conn.cursor()
        cur.execute("insert into pixlcrypt.thumb(src, width, height, item_id) values('" + src + "','" + str(width) + "','" + str(height) + "','" + str(item_id) + "') returning id;")
        res = cur.fetchone()
        if res is not None:
            id = res[0]
        _commit_close(conn, cur)
    finally:
        conn.close()

    return id
