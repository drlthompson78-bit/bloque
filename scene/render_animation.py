"""Render the real 3D hero at 1920 px; reuse identical hold frames losslessly."""
import bpy,os,json,time
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
directory=ROOT/'work/blender/frames';directory.mkdir(parents=True,exist_ok=True)
unique=[1]+list(range(38,106))+list(range(113,181))
for n,frame in enumerate(unique):
    s.frame_set(frame)
    path=directory/f'{frame:04d}.png'
    if not path.exists():
        temporary=path.with_suffix('.full.png')
        s.render.filepath=str(temporary);bpy.ops.render.render(write_still=True)
        if not temporary.exists():raise RuntimeError('Render interrupted at frame '+str(frame))
        os.replace(temporary,path)
    print(f'BLOQUE_FRAME {frame} ({n+1}/{len(unique)})',flush=True)
for frame in range(1,193):
    path=directory/f'{frame:04d}.png'
    if path.exists():continue
    reference=1 if frame<=37 else (105 if frame<=112 else 180)
    os.link(directory/f'{reference:04d}.png',path)
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scene/bloque-studio.blend'))
(directory/'render.json').write_text(json.dumps({'size':[1920,792],'fps':24,'frames':192,'unique':len(unique),'L':[37,105],'Q':[112,180]}))
print('BLOQUE_RENDER_COMPLETE',flush=True)
