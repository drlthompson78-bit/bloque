"""Assemble a native camera-region render onto the matching static camera plate."""
from pathlib import Path
from PIL import Image, ImageDraw
import os,sys
ROOT=Path(__file__).resolve().parent.parent
region=Image.open(sys.argv[1]).convert('RGB')
assert region.size==(530,664),region.size
target=Path(sys.argv[2])
if not target.exists():
    plate=Image.open(ROOT/'work/blender/frames/0001.png').convert('RGB')
    # Blend only the static floor margin to suppress denoiser boundary noise.
    # Animated letters and their shadows are well inside the fully opaque area.
    mask=Image.new('L',region.size,0)
    draw=ImageDraw.Draw(mask)
    for inset in range(33):
        draw.rectangle((inset,inset,529-inset,663-inset),fill=round(255*inset/32))
    plate.paste(region,(920,64),mask)
    temporary=target.with_suffix('.region.png')
    plate.save(temporary)
    os.replace(temporary,target)
