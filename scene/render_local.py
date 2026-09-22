"""Portable local renderer for the same editable scene as the cloud project."""
import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
GLYPHS=json.loads((ROOT/'scene/glyphs.json').read_text())
out=ROOT/'work/blender/previews';out.mkdir(parents=True,exist_ok=True)
class Artifact:
    def __init__(self,name):self.path=out/name
    def publish(self):print('RENDERED',str(self.path),flush=True)
class Artifacts:
    def file(self,name,media_type):return Artifact(name)
artifacts=Artifacts()
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
source=(ROOT/'scene/build_scene.py').read_text()
if bpy.app.version<(4,0,0):
    source='\n'.join(line for line in source.splitlines() if not line.startswith('scene.eevee.'))
    source=source.replace("scene.render.engine='BLENDER_EEVEE'", "scene.render.engine='CYCLES'\nscene.cycles.samples=24\nscene.cycles.use_denoising=True\nscene.cycles.device='CPU'")
    source=source.replace("'Khronos PBR Neutral'", "'Standard'")
    start=source.index('    for layer in action.layers:')
    end=source.index('\n# Small floor crosses',start)
    source=source[:start]+'''    for fcurve in action.fcurves:
        for key in fcurve.keyframe_points:
            key.interpolation='BEZIER'
            key.handle_left_type='AUTO_CLAMPED';key.handle_right_type='AUTO_CLAMPED'
'''+source[end:]
elif bpy.app.version<(5,0,0):
    source=source.replace("'BLENDER_EEVEE'","'BLENDER_EEVEE_NEXT'")
source=source.replace("scene.render.image_settings.media_type='IMAGE'", "pass") if not hasattr(bpy.context.scene.render.image_settings,'media_type') else source
source=source.replace('resolution_x=1280','resolution_x=960').replace('resolution_y=528','resolution_y=396')
exec(compile(source,str(ROOT/'scene/build_scene.py'),'exec'))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'scene/bloque-studio.blend'))
