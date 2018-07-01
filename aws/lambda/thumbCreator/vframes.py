from PIL import Image
import subprocess
import os

def create_frame(input_path, output_path, size):
    subprocess.call(['ffmpeg', '-loglevel', 'panic', '-i', input_path, '-ss', '00:00:00.000', '-vframes', '1', output_path])
    return _resize_frame(output_path, size)

def _resize_frame(filepath, size):
    img = Image.open(filepath)
    img.thumbnail(size, Image.ANTIALIAS)
    new_filepath = _switch_ext(filepath)
    img.save(new_filepath, format='JPEG', subsampling=0, quality=100)
    return {
        'format': 'JPEG',
        'filepath': new_filepath,
        'size': img.size,
        'orientation': 0,
        'date': None
    }

def _switch_ext(filename, ext='jpg'):
    base = os.path.splitext(filename)[0]
    new_filename = base + '.' + ext
    os.rename(filename, new_filename)
    return new_filename
