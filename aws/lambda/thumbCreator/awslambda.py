import boto3
import thumbs
import pixlcrypt_db as db
import urllib
import mimetypes
import time
import datetime
from os import path

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
    name, ext = path.splitext(filename)
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

def _create_thumb(obj, size, filename, suffix):
    thumbname = _get_thumbname(filename, suffix)
    filepath = '/tmp/' + thumbname
    return thumbs.create_thumb(obj, size, filepath)

def handler(event, context, upload_file=True):
    print "Got lambda event. Let's get to work"

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        key = urllib.unquote(key)

        # Download original file from S3
        print 'Downloading file (' + path.join(bucket, key) + ') from s3...'
        obj = _get_file_from_s3(bucket, key)
        print 'Done'

        basename, filename = path.split(key)

        # Create a big thumbnail (*_b.jpg)
        print 'Creating big thumb...'
        b_thumb_info = _create_thumb(obj, B_THUMB_SIZE, filename, '_b')
        print 'Thumbnail %s created in %s' % (b_thumb_info['size'], b_thumb_info['filepath'])

        # Create a small thumbnail (*_t.jpg)
        print 'Creating small thumb...'
        t_thumb_info = _create_thumb(b_thumb_info['filepath'], T_THUMB_SIZE, filename, '_t')
        print 'Thumbnail %s created in %s' % (t_thumb_info['size'], t_thumb_info['filepath'])

        # Make sure the metadata from the orignal is saved in db
        email = key.split('/')[1]
        user_id = db.get_user_id(email)
        src = _to_s3_url(bucket, key)
        mimetype = _get_mimetype(filename)
        mediatype = _get_mediatype(mimetype)

        exif_date = b_thumb_info['date']
        if exif_date:
            try:
                exif_date = _to_timestamp(exif_date)
            except ValueError:
                print 'Got error during timestamp conversion from', exif_date
                exif_date = None

        item_id = db.insert_item(src, mimetype, mediatype, user_id, exif_date)
        print 'Inserted metadata in db with id:', item_id

        if upload_file:
            t_thumb_key = basename + '/.tmb/' + path.split(t_thumb_info['filepath'])[1]

            # Upload small thumbnail to S3
            print 'Uploading file (' + path.join(bucket, t_thumb_key) + ') to s3...'
            CLIENT.upload_file(t_filepath, bucket, t_thumb_key)

            # Save small thumb metadata to db
            t_thumb_src = _to_s3_url(bucket, t_thumb_key)
            t_thumb_id = db.insert_thumb(t_thumb_src, t_thumb_info['size'][0], t_thumb_info['size'][1], item_id)
            print 'Inserted thumb metadata in db', t_thumb_id

        if upload_file:
            b_thumb_key = basename + '/.tmb/' + path.split(b_thumb_info['filepath'])[1]

            # Upload big thumbnail to S3
            print 'Uploading file (' + path.join(bucket, b_thumb_key) + ') to s3...'
            CLIENT.upload_file(b_thumb_info['filepath'], bucket, b_thumb_key)

            # Save big thumb metadata to db
            b_thumb_src = _to_s3_url(bucket, b_thumb_key)
            b_thumb_id = db.insert_thumb(b_thumb_src, b_thumb_info['size'][0], b_thumb_info['size'][1], item_id)
            print 'Inserted thumb metadata in db', b_thumb_id

    print 'All done'
