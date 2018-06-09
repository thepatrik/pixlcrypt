from PIL import Image
from PIL.ExifTags import TAGS

def create_thumb(filename, obj, size, filepath):
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
    img.save(filepath, format='JPEG', subsampling=0, quality=100)
    return img.size
