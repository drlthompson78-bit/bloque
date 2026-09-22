"""Assemble a native camera-region render onto its matching stationary plate."""
from pathlib import Path
from PIL import Image,ImageDraw
import os,sys

region_path,plate_path,output=sys.argv[1:4]
left,top,width,height=map(int,sys.argv[4:8])
region=Image.open(region_path).convert('RGB')
assert region.size==(width,height),region.size
# Reject image-size drift rather than silently rescale letter geometry.
target=Path(output)
if not target.exists():
    plate=Image.open(plate_path).convert('RGB')
    assert plate.size==(3840,1584),plate.size
    # This margin lies outside animated geometry/shadows. It removes only the
    # denoiser's boundary noise; the animated letter remains untouched.
    feather=32
    mask=Image.new('L',region.size,0);draw=ImageDraw.Draw(mask)
    for inset in range(feather+1):
        draw.rectangle((inset,inset,width-1-inset,height-1-inset),fill=round(255*inset/feather))
    plate.paste(region,(left,top),mask)
    temporary=target.with_suffix('.assembled.png')
    plate.save(temporary)
    os.replace(temporary,target)
