from PIL import Image
import subprocess
import os

def create_frame(input_path, output_path, size):
    subprocess.call(['ffmpeg', '-loglevel', 'panic', '-i', input_path, '-ss', '00:00:00.000', '-vframes', '1', output_path])
    return _resize_frame(output_path, size)

def downscale(input_path, output_path):
    subprocess.call(['ffmpeg', '-loglevel', 'panic', '-y', '-i', input_path, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-x264-params', 'me=umh:merange=24:trellis=1:level=4.1:ref=5', '-filter:v', 'crop=3840:2160:0:280,scale=1920:800', '-an', output_path])
    return {
        'format': 'MP4',
        'filepath': output_path,
        'size': (1920, 800),
        'orientation': None,
        'date': None
    }

def chkres(input_path):
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', input_path])
    return out.rstrip()

def _resize_frame(filepath, size):
    img = Image.open(filepath)
    img.thumbnail(size, Image.ANTIALIAS)
    new_filepath = _switch_ext(filepath)
    img.save(new_filepath, format='JPEG', subsampling=0, quality=100)
    return {
        'format': 'JPEG',
        'filepath': new_filepath,
        'size': img.size,
        'orientation': None,
        'date': None
    }

def _switch_ext(filename, ext='jpg'):
    base = os.path.splitext(filename)[0]
    new_filename = base + '.' + ext
    os.rename(filename, new_filename)
    return new_filename
