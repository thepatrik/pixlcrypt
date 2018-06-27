from PIL import Image
from PIL.ExifTags import TAGS

def create_thumb(obj, filepath, size):
    with Image.open(obj) as img:
        date = get_date_time_original(img)
        orientation = get_exif_orientation(img)
        if orientation == 3:
            img = img.rotate(180)
        elif orientation == 6:
            img = img.rotate(270)
        elif orientation == 8:
            img = img.rotate(90)

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
