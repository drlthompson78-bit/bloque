"""Render the locked-camera hero at 3840 x 1584, preserving sharp edges.

BLOQUE_RENDER_MODE=proof renders full-resolution raised/recessed proofs only.
The animation reuses the static plate and ray traces each moving letter and its
nearby shadows at exactly the same camera, resolution and Cycles quality.
"""
import bpy, os, json, subprocess, shutil, time
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'work/blender/sharp-v2'
FRAMES=OUT/'frames';REGIONS=OUT/'regions';PROOFS=OUT/'proofs'
for path in [FRAMES,REGIONS,PROOFS]:path.mkdir(parents=True,exist_ok=True)
mode=os.environ.get('BLOQUE_RENDER_MODE','all')
assert mode in ['all','proof','animation']
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'scene/bloque-studio.blend'))
s=bpy.context.scene
s.view_settings.exposure=-.25
s.render.resolution_x=3840;s.render.resolution_y=1584
s.render.resolution_percentage=100
s.render.engine='CYCLES';s.cycles.device='CPU'
s.cycles.samples=64;s.cycles.use_denoising=True
s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.02
s.cycles.adaptive_min_samples=16
s.cycles.filter_width=.75
s.cycles.denoising_prefilter='ACCURATE'
s.cycles.denoising_input_passes='RGB_ALBEDO_NORMAL'
s.cycles.use_animated_seed=False
s.cycles.max_bounces=6;s.cycles.diffuse_bounces=3;s.cycles.glossy_bounces=3
# Persistent Cycles data produced black shared-material faces in the last
# boolean-animation frames. Rebuild render data to preserve the proven lighting.
s.render.use_persistent_data=False
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB'
s.render.use_border=False;s.render.use_crop_to_border=False

def render(frame,path):
    if (OUT/'STOP').exists():raise RuntimeError('Render stopped at a frame boundary')
    s.frame_set(frame)
    temporary=path.with_suffix('.render.png')
    s.render.filepath=str(temporary)
    bpy.ops.render.render(write_still=True)
    if not temporary.exists():raise RuntimeError('Render interrupted at frame '+str(frame))
    os.replace(temporary,path)

if mode!='animation':
    for frame,name in [(1,'raised-4k.png'),(180,'recessed-4k.png')]:
        path=PROOFS/name
        if not path.exists():render(frame,path)
        print('BLOQUE_PROOF',str(path),flush=True)

plate=FRAMES/'0001.png'
if not plate.exists():shutil.copyfile(PROOFS/'raised-4k.png',plate)

if mode!='proof':
    # Integer pixel bounds in the delivery camera; margins include the changing
    # cast/contact shadows as each solid lowers through the floor.
    stages=[('L',range(38,106),(2160,310,2780,670),FRAMES/'0001.png'),
            ('Q',range(113,181),(2040,700,2620,1080),FRAMES/'0105.png')]
    total=136;done=0;started=time.time()
    for letter,frames,(left,top,right,bottom),reference in stages:
        s.render.use_border=True;s.render.use_crop_to_border=True
        s.render.border_min_x=left/3840;s.render.border_max_x=right/3840
        s.render.border_min_y=(1584-bottom)/1584;s.render.border_max_y=(1584-top)/1584
        for frame in frames:
            final=FRAMES/f'{frame:04d}.png'
            if not final.exists():
                region=REGIONS/f'{frame:04d}.png'
                if not region.exists():render(frame,region)
                subprocess.run([shutil.which('python3'),str(ROOT/'scene/assemble_region.py'),
                    str(region),str(reference),str(final),str(left),str(top),
                    str(right-left),str(bottom-top)],check=True)
            done+=1
            print(f'BLOQUE_FRAME {frame} ({done}/{total}) {time.time()-started:.1f}s',flush=True)
    for frame in range(1,193):
        path=FRAMES/f'{frame:04d}.png'
        if path.exists():continue
        reference=1 if frame<=37 else (105 if frame<=112 else 180)
        os.link(FRAMES/f'{reference:04d}.png',path)
    s.render.use_border=False;s.render.use_crop_to_border=False
    s.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scene/bloque-studio.blend'))
    (FRAMES/'render.json').write_text(json.dumps({'size':[3840,1584],'fps':24,'frames':192,
        'samples':64,'adaptive_min_samples':16,'filter_width':.75,'L':[37,105],'Q':[112,180]}))
    print('BLOQUE_RENDER_COMPLETE',flush=True)
