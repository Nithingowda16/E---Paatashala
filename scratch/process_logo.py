from PIL import Image

img = Image.open('frontend/public/nxtwave-logo.png').convert('RGBA')
width, height = img.size
pixels = img.load()

# Create light mode transparent
img_light = Image.new('RGBA', (width, height))
pix_light = img_light.load()

# Create dark mode transparent
img_dark = Image.new('RGBA', (width, height))
pix_dark = img_dark.load()

for x in range(width):
    for y in range(height):
        r, g, b, a = pixels[x, y]
        # Check if background (white or near white)
        if r > 225 and g > 225 and b > 225:
            pix_light[x, y] = (0, 0, 0, 0)
            pix_dark[x, y] = (0, 0, 0, 0)
        else:
            # Smooth edge anti-aliasing alpha adjustment if near white
            alpha = a
            if r > 180 and g > 180 and b > 180:
                avg = (r + g + b) / 3.0
                alpha = int(a * (255 - avg) / 75.0)
                alpha = max(0, min(255, alpha))

            pix_light[x, y] = (r, g, b, alpha)

            # Dark mode: replace dark navy/blue pixels with crisp white/light blue
            if r < 60 and g < 80 and b < 120:
                # Dark navy text -> convert to crisp white
                pix_dark[x, y] = (255, 255, 255, alpha)
            else:
                # Keep bright blue elements (NXT blue, arrow)
                pix_dark[x, y] = (r, g, b, alpha)

# Crop transparent margins for a clean tight bounding box
bbox_light = img_light.getbbox()
if bbox_light:
    img_light = img_light.crop(bbox_light)

bbox_dark = img_dark.getbbox()
if bbox_dark:
    img_dark = img_dark.crop(bbox_dark)

img_light.save('frontend/public/nxtwave-logo-light.png', 'PNG')
img_dark.save('frontend/public/nxtwave-logo-dark.png', 'PNG')

print(f"Processed successfully! Light crop: {img_light.size}, Dark crop: {img_dark.size}")
