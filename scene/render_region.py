"""Render the moving area with the same camera and Cycles settings.

The camera is locked. Reusing its static surroundings speeds up rendering while
the actual animated geometry and all nearby shadows are still ray traced.
"""
import bpy, json, os, subprocess, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'scene/bloque-studio.blend'))
s=bpy.context.scene
s.view_settings.exposure=-.25
s.render.resolution_x=1920;s.render.resolution_y=792
s.render.resolution_percentage=100
s.render.engine='CYCLES';s.cycles.device='CPU'
s.cycles.samples=16;s.cycles.use_denoising=True
s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.06
s.cycles.adaptive_min_samples=8
s.cycles.max_bounces=6;s.cycles.diffuse_bounces=3;s.cycles.glossy_bounces=3
s.render.use_persistent_data=True
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB'
s.render.use_border=True;s.render.use_crop_to_border=True
# Margin extends well beyond L/Q and their changing shadows.
s.render.border_min_x=920/1920;s.render.border_max_x=1450/1920
s.render.border_min_y=(792-728)/792;s.render.border_max_y=(792-64)/792
directory=ROOT/'work/blender/regions';directory.mkdir(parents=True,exist_ok=True)
check=os.environ.get('BLOQUE_REGION_CHECK')
frames=[int(check)] if check else [105]+list(range(180,112,-1))
for frame in frames:
    final=ROOT/f'work/blender/frames/{frame:04d}.png'
    if final.exists() and not check:continue
    s.frame_set(frame);s.render.filepath=str(directory/f'{frame:04d}.png')
    bpy.ops.render.render(write_still=True)
    if not check:
        subprocess.run([shutil.which('python3'),str(ROOT/'scene/assemble_region.py'),
                        s.render.filepath,str(final)],check=True)
    print('BLOQUE_REGION',frame,flush=True)
