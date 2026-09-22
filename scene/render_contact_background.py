"""Render the contact floor using the approved hero camera and materials.

Run with Blender 3.6 in background mode; the hero .blend stays unchanged.
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parent.parent
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'scene/bloque-studio.blend'))
scene = bpy.context.scene
for obj in scene.objects:
    if obj.type not in {'LIGHT', 'CAMERA'}:
        obj.hide_render = True
ground = bpy.data.objects['Continuous floor with exact L and Q recesses']
ground.hide_render = False
for modifier in ground.modifiers:
    modifier.show_render = False

# Continue the same grid through the space normally occupied by the wordmark.
verts, faces = [], []
for ix in range(-25, 26):
    for iy in range(-35, 36):
        x, y = ix * 1.3 + .42, iy * 1.3 + .34
        for hx, hy in [(.12, .003), (.003, .12)]:
            n = len(verts)
            verts.extend([(x-hx, y-hy, .001), (x+hx, y-hy, .001),
                          (x+hx, y+hy, .001), (x-hx, y+hy, .001)])
            faces.append((n, n+1, n+2, n+3))
mesh = bpy.data.meshes.new('Contact registration grid')
mesh.from_pydata(verts, [], faces)
marks = bpy.data.objects.new('Contact floor crosses', mesh)
scene.collection.objects.link(marks)
marks.data.materials.append(bpy.data.materials['Subtle registration marks'])
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.use_persistent_data = False
scene.render.resolution_x = 2400
scene.render.resolution_y = 2100
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 92
scene.render.filepath = str(ROOT / 'dist/assets/bloque-contact-floor.jpg')
bpy.ops.render.render(write_still=True)
