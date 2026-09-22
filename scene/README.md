# BLOQUE hero — editable 3D source

The six letters, floor, recesses, camera and lights belong to one Blender scene.
The hero video is a reconstruction of the reference, not the original KRAVT model.
All letters share one graphite material, edge treatment and lighting rig. The Q uses the O outline with a straight, constant-width diagonal tail; its raised solid and floor opening are built from the same boolean union. The L
and Q move only vertically; their outline never changes. The center island of Q
is part of the floor, so it stays level with the surface throughout the animation.

## Files

- `bloque-studio.blend`: editable production scene, including animation and camera.
- `glyphs.json`: normalized vector outlines used for the letters and matching holes.
- `export_glyphs.py`: extracts those outlines from locally installed Arial Bold.
- `build_scene.py`: builds the geometry, lights, camera and animation.
- `render_local.py`: runs the builder locally and saves the editable scene.
- `render_animation.py`: renders the production sequence from that scene.
- `assemble_region.py`: combines the native camera regions with their matching stationary plate. Requires Pillow in system Python. All changing geometry and nearby shadows are rendered in Cycles; the blend margin covers stationary surroundings only.

## Timing

192 frames at 24 fps (8 seconds), rendered at 3840 × 1584:

| Frames | Action |
| --- | --- |
| 1–37 | All letters raised; initial hold of about 1.5 seconds |
| 37–105 | L lowers smoothly into its matching recess |
| 105–112 | Short pause |
| 112–180 | Q lowers smoothly into its matching recess |
| 180–192 | Both letters remain recessed |

The page starts playback once its entrance animation reveals the hero. It keeps
the last video frame when playback finishes, without swapping to another drawing.
Reduced-motion visitors, or browsers that cannot play the video, get the rendered
final still. Offscreen and hidden-tab playback pauses and resumes.

## Rebuild

Production was rendered using Blender 3.6.23, Cycles CPU, denoising, up to 64 samples (adaptive, minimum 16),
Standard color management, a 0.75-pixel reconstruction filter and exposure -0.25. The letter outlines use 32 subdivisions per curve, angle-limited smooth normals and a 4 mm edge bevel. The floor material is based on
`#F3F4EF`; its rendered pixels vary naturally with lighting and shadow.
Cycles persistent data stays disabled: retaining its cache caused intermittent dark material patches during the animation on the local Blender 3.6 CPU renderer.

Run from the repository root with Blender and FFmpeg installed:

```sh
BLOQUE_SKIP_PREVIEWS=1 blender --background --gpu-backend opengl --factory-startup --python scene/render_local.py
BLOQUE_RENDER_MODE=proof blender --background --gpu-backend opengl --factory-startup --python scene/render_animation.py
BLOQUE_RENDER_MODE=animation blender --background --gpu-backend opengl --factory-startup --python scene/render_animation.py
ffmpeg -framerate 24 -i work/blender/sharp-v2/frames/%04d.png -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart -an -y dist/assets/bloque-3d-sinking-4k.mp4
ffmpeg -i work/blender/sharp-v2/frames/0001.png -frames:v 1 -q:v 1 -y dist/assets/bloque-3d-raised-4k.jpg
ffmpeg -i work/blender/sharp-v2/frames/0180.png -frames:v 1 -q:v 1 -y dist/assets/bloque-3d-recessed-4k.jpg
```

The renderer resumes from existing PNG frames. Move or clear the generated
`work/blender/sharp-v2/frames`, `regions` and `proofs` directories before rendering a changed scene to avoid reusing
old frames. Blender runtimes and intermediate frames stay untracked under `work/`.

The related 3D Jutsu project is
`2892a976-6562-4b6d-a5a8-5030af396c64` (revision 2). It is the earlier scene version, before the straight Q-tail and sharpness revision. Its timing is unchanged, but its geometry and lighting are superseded locally. The local `.blend` and exported video
are the production authority; the GLB viewer does not reproduce Cycles lighting.
