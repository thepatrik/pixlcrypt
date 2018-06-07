import boto3
import thumbs
import pixlcrypt_db as db
import urllib
from os import path

S3_URL = 'https://s3-eu-west-1.amazonaws.com/'
THUMB_SIZE = 300, 300
JPG_EXT = '.jpg'
CLIENT = boto3.client('s3')

def get_file_from_s3(bucket, key):
    obj = CLIENT.get_object(
        Bucket=bucket,
        Key=key
    )
    return obj['Body']

def upload_file_to_s3(path, bucket, key):
    CLIENT.upload_file(path, bucket, key)

def to_s3_url(bucket, key):
    return S3_URL + bucket + '/' + key

def getThumbName(filename):
    name, ext = path.splitext(filename)
    if len(name) > 1 and name[-2:] == '_o':
        name = name[:-2]

    return name + '_t' + JPG_EXT

def handler(event, context, upload_file=True):
    print "Got lambda event. Let's get to work"

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        key = urllib.unquote(key)

        # Download original file from S3
        print 'Downloading file (' + path.join(bucket, key) + ') from s3...'
        obj = get_file_from_s3(bucket, key)

        # Make sure the metadata from the orignal is saved in db
        email = key.split('/')[1]
        user_id = db.get_user_id(email)
        src = to_s3_url(bucket, key)
        item_id = db.insert_item(src, 'image/jpeg', 'photo', user_id)
        print 'Inserted metadata in db', item_id

        # Create thumbnail from original
        basename, filename = path.split(key)
        thumbName = getThumbName(filename)
        filepath = '/tmp/' + filename
        thumb_size = thumbs.create_thumb(thumbName, obj, THUMB_SIZE, filepath)
        print 'Thumbnail %s created in %s' % (thumb_size, filepath)

        if upload_file:
            # Upload thumbnail to S3
            thumb_key = basename + '/.tmb/' + thumbName
            print 'Uploading file (' + path.join(bucket, thumb_key) + ') to s3...'
            upload_file_to_s3(filepath, bucket, thumb_key)

            # Save thumb metadata to db
            thumb_src = to_s3_url(bucket, thumb_key)
            thumb_id = db.insert_thumb(thumb_src, thumb_size[0], thumb_size[1], item_id)
            print 'Inserted thumb metadata in db', thumb_id

    print 'All done'
