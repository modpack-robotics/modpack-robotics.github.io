import sys
import os
import glob

# Add FreeCAD libs to path
freecad_lib = '/Applications/FreeCAD.app/Contents/Resources/lib/python3.11/site-packages'
freecad_so = '/Applications/FreeCAD.app/Contents/Resources/lib'
sys.path.insert(0, freecad_lib)
sys.path.insert(0, freecad_so)
os.environ['FREECAD_USER_HOME'] = '/tmp/freecad_home'

import FreeCAD
import Import
import Mesh

input_dir = os.path.expanduser('~/Downloads/Right Arm')
output_dir = 'models/arm_right/parts'
os.makedirs(output_dir, exist_ok=True)

step_files = sorted(glob.glob(os.path.join(input_dir, '*.step')))
print(f"Found {len(step_files)} STEP files")

for step_path in step_files:
    name = os.path.splitext(os.path.basename(step_path))[0]
    obj_path = os.path.join(output_dir, name + '.obj')

    print(f"Converting: {name}")
    doc = FreeCAD.newDocument('tmp')
    Import.insert(step_path, doc.Name)
    doc.recompute()

    # Export all shapes as mesh OBJ
    objs = [o for o in doc.Objects if hasattr(o, 'Shape')]
    if objs:
        Mesh.export(objs, obj_path)
        print(f"  -> {obj_path}")
    else:
        print(f"  No shapes found in {name}")

    FreeCAD.closeDocument(doc.Name)

print("Done. Now run: for f in models/arm_right/parts/*.obj; do npx obj2gltf -i \"$f\" -o \"${f%.obj}.glb\"; done")
