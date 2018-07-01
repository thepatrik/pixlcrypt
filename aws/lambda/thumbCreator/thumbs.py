from PIL import Image
from PIL.ExifTags import TAGS

def create_thumb(obj, filepath, size):
    with Image.open(obj) as img:
        date = get_date_time_original(img)
        exif_orientation = get_exif_orientation(img)
        orientation = _to_orientation_degrees(exif_orientation)
        if (orientation is not None and orientation > 0):
            img = img.rotate(orientation)

        img = img.convert('RGB')
        img.thumbnail(size, Image.ANTIALIAS)
        img.save(filepath, format='JPEG', subsampling=0, quality=100)
        size = img.size
        return {
            'size': size,
            'format': "JPEG",
            'orientation': orientation,
            'date': date,
            'filepath': filepath
        }

def _to_orientation_degrees(exif_orientation):
    orientation = 0

    if exif_orientation is None:
        orientation = None
    if exif_orientation == 3:
        orientation = 180
    elif exif_orientation == 6:
        orientation = 270
    elif exif_orientation == 8:
        orientation = 90

    return orientation

def get_exif_orientation(img):
    if hasattr(img, '_getexif'):
        exif = img._getexif()
        if exif != None:
            for tag, value in exif.items():
                decoded = TAGS.get(tag, tag)
                if decoded == 'Orientation':
                    return value
    return None

def get_date_time_original(img):
    if hasattr(img, '_getexif'):
        exif = img._getexif()
        if exif != None and 36867 in exif:
            return exif[36867]
    return None
