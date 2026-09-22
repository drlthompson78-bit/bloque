"""BLOQUE hero: one editable scene, one light rig, genuine recessed solids.

The runner prepends GLYPHS from glyphs.json. Run in Blender / 3D Jutsu.
"""
import bpy, math
from mathutils import Vector

scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'
scene.eevee.taa_render_samples=32
scene.eevee.use_raytracing=True
scene.eevee.use_fast_gi=True
scene.eevee.fast_gi_distance=3
scene.render.resolution_x=1280
scene.render.resolution_y=528
scene.render.resolution_percentage=100
scene.render.fps=24
scene.frame_start=1
scene.frame_end=192
scene.render.film_transparent=False
scene.view_settings.view_transform='Khronos PBR Neutral'
scene.view_settings.exposure=-.25

def linear(v):
    return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def material(name, color, roughness):
    mat=bpy.data.materials.new(name)
    mat.use_nodes=True
    shader=mat.node_tree.nodes.get('Principled BSDF')
    rgba=tuple(linear(c) for c in color)+(1,)
    shader.inputs['Base Color'].default_value=rgba
    shader.inputs['Roughness'].default_value=roughness
    shader.inputs['Metallic'].default_value=0
    mat.diffuse_color=rgba
    return mat

graphite=material('Matte graphite • all six letters',(.105,.112,.115),.72)
floor_mat=material('Warm neutral floor • F3F4EF',(.953,.957,.937),.88)
grid_mat=material('Subtle registration marks',(.67,.69,.66),.9)

def curve(name, contours, extrude):
    data=bpy.data.curves.new(name,'CURVE')
    data.dimensions='2D';data.fill_mode='BOTH';data.extrude=extrude;data.resolution_u=1
    for path in contours:
        spline=data.splines.new('POLY');spline.points.add(len(path)-1)
        for point,(x,y) in zip(spline.points,path):point.co=(x,y,0,1)
        spline.use_cyclic_u=True
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj)
    return obj

def glyph_solid(name, letter, extrude):
    # Q shares O's round body. Its tail is one straight, constant-width bar;
    # Arial's curved tail is deliberately not used for the mark.
    obj=curve(name,GLYPHS['O' if letter=='Q' else letter],extrude)
    if letter!='Q':return obj
    start=Vector((.105,-.17));end=Vector((.595,-.68))
    axis=(end-start).normalized();side=Vector((-axis.y,axis.x))*.102
    contour=[list(start+side),list(start-side),list(end-side),list(end+side)]
    bar=curve(name+' straight tail',[contour],extrude)
    for part in [obj,bar]:
        bpy.ops.object.select_all(action='DESELECT')
        part.select_set(True);bpy.context.view_layer.objects.active=part
        bpy.ops.object.convert(target='MESH');part.select_set(False)
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    union=obj.modifiers.new('Straight Q tail union','BOOLEAN')
    union.operation='UNION';union.solver='EXACT';union.object=bar
    bpy.ops.object.modifier_apply(modifier=union.name)
    bpy.data.objects.remove(bar,do_unlink=True)
    obj.select_set(False)
    return obj

letters={}
cutters=[]
for i,letter in enumerate('BLOQUE'):
    y=(2.5-i)*1.65
    obj=glyph_solid('Letter '+letter,letter,.09)
    obj.location=(0,y,.09)
    obj.data.materials.append(graphite)
    bpy.context.view_layer.objects.active=obj;obj.select_set(True)
    bpy.ops.object.convert(target='MESH');obj.select_set(False)
    for p in obj.data.polygons:p.use_smooth=abs(p.normal.z)<.5
    if hasattr(obj.data,'use_auto_smooth'):
        obj.data.use_auto_smooth=True
        obj.data.auto_smooth_angle=math.radians(30)
    if letter=='Q':
        tail_axis=Vector((.49,-.51,0)).normalized()
        tail_side=Vector((-tail_axis.y,tail_axis.x,0))
        for p in obj.data.polygons:
            if abs(p.normal.dot(tail_axis))>.9999 or abs(p.normal.dot(tail_side))>.9999:
                p.use_smooth=False
    bevel=obj.modifiers.new('Soft manufactured edges','BEVEL')
    bevel.width=.004;bevel.segments=3
    bevel.limit_method='ANGLE';bevel.angle_limit=.52
    normal=obj.modifiers.new('Weighted face normals','WEIGHTED_NORMAL')
    normal.keep_sharp=True;normal.weight=40
    letters[letter]=obj
    if letter in 'LQ':
        cut=glyph_solid('Exact '+letter+' floor opening',letter,.65)
        cut.location=(0,y,0)
        bpy.context.view_layer.objects.active=cut;cut.select_set(True)
        bpy.ops.object.convert(target='MESH');cut.select_set(False)
        cut.data.materials.append(floor_mat);cut.data.materials.append(graphite)
        for polygon in cut.data.polygons:polygon.material_index=1
        cut.hide_render=True;cut.display_type='WIRE'
        cutters.append(cut)

bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,-.375))
ground=bpy.context.object;ground.name='Continuous floor with exact L and Q recesses'
ground.scale=(45,45,.75)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
ground.data.materials.append(floor_mat)
ground.data.materials.append(graphite)
for cut in cutters:
    boolean=ground.modifiers.new('Recess '+cut.name,'BOOLEAN')
    boolean.operation='DIFFERENCE';boolean.solver='EXACT';boolean.object=cut

# The raised tops begin .18 m above the surface. Their final top is .16 m below.
# The middle of Q belongs to the floor and never moves.
for letter,start,finish in [('L',37,105),('Q',112,180)]:
    obj=letters[letter]
    for frame,z in [(1,.09),(start,.09),(finish,-.25),(192,-.25)]:
        obj.location.z=z;obj.keyframe_insert(data_path='location',index=2,frame=frame)
    action=obj.animation_data.action
    for layer in action.layers:
        for strip in layer.strips:
            for bag in strip.channelbags:
                for fcurve in bag.fcurves:
                    for key in fcurve.keyframe_points:
                        key.interpolation='BEZIER'
                        key.handle_left_type='AUTO_CLAMPED';key.handle_right_type='AUTO_CLAMPED'

# Small floor crosses live in the same perspective as the type.
verts=[];faces=[]
for ix in range(-15,16):
    for iy in range(-19,20):
        x=ix*1.3+.42;y=iy*1.3+.34
        if abs(x)<.9 and abs(y)<5.2:continue
        for half_x,half_y in [(.12,.003),(.003,.12)]:
            n=len(verts)
            verts.extend([(x-half_x,y-half_y,.001),(x+half_x,y-half_y,.001),
                          (x+half_x,y+half_y,.001),(x-half_x,y+half_y,.001)])
            faces.append((n,n+1,n+2,n+3))
mesh=bpy.data.meshes.new('Registration grid geometry');mesh.from_pydata(verts,[],faces)
marks=bpy.data.objects.new('Fine floor registration crosses',mesh);scene.collection.objects.link(marks)
marks.data.materials.append(grid_mat)

direction=Vector((4,-16,10)).normalized()
right=Vector((16,4,0)).normalized()
target=-right*2.2
camera_data=bpy.data.cameras.new('Hero orthographic camera')
camera=bpy.data.objects.new('Hero delivery camera',camera_data);scene.collection.objects.link(camera)
camera.location=target+direction*24
camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO';camera_data.ortho_scale=17.2
camera_data.lens=50
scene.camera=camera

def light(name,kind,location,energy,size=1,target=(0,0,0)):
    data=bpy.data.lights.new(name,kind);data.energy=energy
    if kind=='AREA':data.shape='DISK';data.size=size
    if kind=='SUN':data.angle=size
    obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=location
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    return obj
light('Large softbox • upper right','AREA',(7,4,10),350,4)
light('Soft front fill','AREA',(-5,-8,7),70,8)
light('Directional daylight','SUN',(7,4,10),2.9,.09)
world=bpy.data.worlds.new('Neutral studio ambient');world.use_nodes=True
world.node_tree.nodes.get('Background').inputs['Color'].default_value=(1,1,1,1)
world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.35
scene.world=world

scene.frame_set(1)
scene.render.image_settings.media_type='IMAGE'
scene.render.image_settings.file_format='PNG'
for name,frame in [('raised.png',1),('recessed.png',192)]:
    target_file=artifacts.file(name=name,media_type='image/png')
    scene.frame_set(frame);scene.render.filepath=str(target_file.path)
    bpy.ops.render.render(write_still=True);target_file.publish()
scene.frame_set(1)
result={'letters':{key:list(obj.dimensions) for key,obj in letters.items()},
        'frames':[1,37,105,112,180,192],'fps':24,'camera':list(camera.location),
        'resolution':[scene.render.resolution_x,scene.render.resolution_y]}
