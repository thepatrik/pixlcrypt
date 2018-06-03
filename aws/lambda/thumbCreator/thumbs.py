import boto3
from os import path
from PIL import Image
from PIL.ExifTags import TAGS

thumb_width = 300
thumb_height = 300
thumb_size = thumb_width, thumb_height
client = boto3.client('s3')

def get_file_from_s3(bucket, key):
    obj = client.get_object(
        Bucket=bucket,
        Key=key
    )
    return obj['Body']

def upload_file_to_s3(path, bucket, key):
    client.upload_file(path, bucket, key)

def create_thumb(filename, obj, size):
    img = Image.open(obj)
    exif = img._getexif()
    if exif != None:
        for tag, value in exif.items():
            decoded = TAGS.get(tag, tag)
            if decoded == 'Orientation':
                if value == 3: img = img.rotate(180)
                if value == 6: img = img.rotate(270)
                if value == 8: img = img.rotate(90)
                break

    img.thumbnail(size, Image.ANTIALIAS)
    filepath = '/tmp/' + filename
    img.save(filepath, 'JPEG')
    return filepath

def lambda_handler(event, context):
    print "Got lambda event. Let's get to work"

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        print 'Downloading file (' + path.join(bucket, key) + ') from s3...'
        obj = get_file_from_s3(bucket, key)

        basename, filename = path.split(key)
        filepath = create_thumb(filename, obj, thumb_size)
        print 'Thumbnail (' + str(thumb_width) + 'x' + str(thumb_height) + ') created in', filepath

        thumb_key = basename + '/.tmb/' + filename
        print 'Uploading file (' + path.join(bucket, thumb_key) + ') to s3...'
        upload_file_to_s3(filepath, bucket, thumb_key)

    print 'All done'
