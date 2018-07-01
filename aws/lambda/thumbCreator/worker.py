import boto3
import thumbs
import vframes
import pixlcrypt_db as db
import mimetypes
import time
import datetime
import os
from os import path
import time

S3_URL = 'https://s3-eu-west-1.amazonaws.com/'
T_THUMB_SIZE = 300, 300
B_THUMB_SIZE = 1024, 1024
JPG_EXT = '.jpg'
CLIENT = boto3.client('s3')

def _get_file_from_s3(bucket, key):
    obj = CLIENT.get_object(
        Bucket=bucket,
        Key=key
    )
    return obj['Body']

def _to_s3_url(bucket, key):
    return S3_URL + bucket + '/' + key

def _get_thumbname(filename, suffix='_t', ext=JPG_EXT):
    name, _ = path.splitext(filename)
    if len(name) > 1 and name[-2:] == '_o':
        name = name[:-2]

    return name + suffix + ext

def _get_mimetype(filename):
    return mimetypes.guess_type(filename)[0]

def _get_mediatype(mimetype):
    t = mimetype.split('/')[0]
    return 'photo' if t == 'image' else 'video'

def _to_timestamp(s):
    return int(time.mktime(datetime.datetime.strptime(s, '%Y:%m:%d %H:%M:%S').timetuple()))

def _create_thumb(obj, size, filename, suffix, mediatype):
    if mediatype == 'photo':
        thumbname = _get_thumbname(filename, suffix)
        filepath = '/tmp/' + thumbname
        return thumbs.create_thumb(obj, filepath, size)
    elif mediatype == 'video':
        thumbname = _get_thumbname(filename, suffix, '.png')
        filepath = '/tmp/' + thumbname
        return vframes.create_frame(obj, filepath, size)

def _get_presigned_url(bucket, key):
    s3 = boto3.client('s3')

    return s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket,
            'Key': key
        }
    )

def _set_env():
    if os.environ.get('LAMBDA_TASK_ROOT') is not None:
        os.environ['PATH'] = os.environ['PATH'] + ':/var/task'
        os.environ['FFMPEG_PATH'] = os.environ.get('LAMBDA_TASK_ROOT') + '/ffmpeg'

def _create_thumbnails(bucket, key, upload_file):
    # Find user
    email = key.split('/')[1]
    user_id = db.get_user_id(email)
    if user_id is None:
        print('Exiting - No user id found in db with email address: ' + email)
        return

    basename, filename = path.split(key)
    mimetype = _get_mimetype(filename)
    mediatype = _get_mediatype(mimetype)

    if mediatype == 'photo':
        # Download original file from S3
        print('Downloading file (' + path.join(bucket, key) + ') from s3...')
        start_time = time.time()
        obj = _get_file_from_s3(bucket, key)
        print('Done, took %s secs.' % round(time.time() - start_time, 2))

    elif mediatype == 'video':
        obj = _get_presigned_url(bucket, key)

    # Create a big thumbnail (*_b.jpg)
    print('Creating big thumb...')
    start_time = time.time()
    b_thumb_info = _create_thumb(obj, B_THUMB_SIZE, filename, '_b', mediatype)
    print('Thumbnail %s created in %s' % (b_thumb_info['size'], b_thumb_info['filepath']) + ', took %s secs.' % round(time.time() - start_time, 2))

    # Create a small thumbnail (*_t.jpg)
    print('Creating small thumb...')
    start_time = time.time()
    t_thumb_info = _create_thumb(b_thumb_info['filepath'], T_THUMB_SIZE, filename, '_t', mediatype)
    print('Thumbnail %s created in %s' % (t_thumb_info['size'], t_thumb_info['filepath']) + ', took %s secs.' % round(time.time() - start_time, 2))

    # Make sure the metadata from the orignal is saved in db
    src = _to_s3_url(bucket, key)

    exif_date = b_thumb_info['date']
    if exif_date:
        try:
            exif_date = _to_timestamp(exif_date)
        except ValueError:
            print('Got error during timestamp conversion from', exif_date)
            exif_date = None

    orientation = b_thumb_info['orientation']
    item_id = db.insert_item(src, mimetype, orientation, mediatype, user_id, exif_date)
    print('Inserted metadata in db with id: ' + str(item_id))

    if upload_file:
        t_thumb_key = basename + '/.tmb/' + path.split(t_thumb_info['filepath'])[1]

        # Upload small thumbnail to S3
        print('Uploading file (' + path.join(bucket, t_thumb_key) + ') to s3...')
        start_time = time.time()
        CLIENT.upload_file(t_thumb_info['filepath'], bucket, t_thumb_key)
        print('Done, took %s secs.' % round(time.time() - start_time, 2))

        # Save small thumb metadata to db
        t_thumb_src = _to_s3_url(bucket, t_thumb_key)
        t_thumb_id = db.insert_thumb(t_thumb_src, t_thumb_info['size'][0], t_thumb_info['size'][1], item_id)
        print('Inserted thumb metadata in db with id: ' +  str(t_thumb_id))

    if upload_file:
        b_thumb_key = basename + '/.tmb/' + path.split(b_thumb_info['filepath'])[1]

        # Upload big thumbnail to S3
        print('Uploading file (' + path.join(bucket, b_thumb_key) + ') to s3...')
        start_time = time.time()
        CLIENT.upload_file(b_thumb_info['filepath'], bucket, b_thumb_key)
        print('Done, took %s secs.' % round(time.time() - start_time, 2))

        # Save big thumb metadata to db
        b_thumb_src = _to_s3_url(bucket, b_thumb_key)
        b_thumb_id = db.insert_thumb(b_thumb_src, b_thumb_info['size'][0], b_thumb_info['size'][1], item_id)
        print('Inserted thumb metadata in db with id: ' + str(b_thumb_id))

def start(tasks, upload_file=True):
    _set_env()

    for bucket, key in tasks:
        _, filename = path.split(key)
        mimetype = _get_mimetype(filename)

        print('---- CREATE THUMBNAIL ----')
        print('AWS S3 Bucket: ' + bucket)
        print('AWS S3 Key: ' + key)
        print('MIME type: ' + mimetype)
        print('----')
        try:
            _create_thumbnails(bucket, key, upload_file)
        finally:
            print('---------------------------')
