import os
import urllib
import worker

def _set_env():
    if os.environ.get('LAMBDA_TASK_ROOT') is not None:
        os.environ['PATH'] = os.environ['PATH'] + ':/var/task'
        os.environ['FFMPEG_PATH'] = os.environ.get('LAMBDA_TASK_ROOT') + '/ffmpeg'

def handler(event, context, upload_file=True):
    _set_env()
    tasks = []

    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        key = urllib.unquote(key)

        tasks.append((bucket, key))

    worker.start(tasks, upload_file)
