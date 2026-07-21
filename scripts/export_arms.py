"""
STEP → OBJ export script for arm models, run via FreeCAD headless.
Exports each logical arm link as a separate OBJ file, preserving world-space
positions so the parts align correctly with the backpack scene in Three.js.

Usage (called by export_arms.sh):
  freecadcmd export_arms.py <step_file> <output_dir> <arm_label>
"""

import sys
import os
import FreeCAD
import Import
import Mesh
import MeshPart
import Part

step_file  = sys.argv[1]   # e.g. /Users/josh/Downloads/Right Arm.step
output_dir = sys.argv[2]   # e.g. /tmp/arm_right
arm_label  = sys.argv[3]   # e.g. "right" or "arx"

os.makedirs(output_dir, exist_ok=True)

print(f"[freecad] Loading {step_file} ...")
doc = FreeCAD.newDocument("export")
Import.insert(step_file, "export")
print(f"[freecad] Loaded {len(doc.Objects)} objects")

# ── collect all Part::Feature objects with valid shapes ─────────────────────
def collect_shapes_recursive(part_obj):
    """Return list of (label, shape_with_placement) for all solid children."""
    results = []
    group = getattr(part_obj, 'Group', [])
    for child in group:
        if child.TypeId == 'Part::Feature' and hasattr(child, 'Shape'):
            try:
                s = child.Shape.copy()
                # Apply placement so shapes are in world space
                s.Placement = child.getGlobalPlacement()
                if s.Solids:
                    results.append((child.Label, s))
            except Exception as e:
                print(f"[freecad]   skip {child.Label}: {e}")
        elif child.TypeId == 'App::Part':
            results.extend(collect_shapes_recursive(child))
    return results

# ── logical groupings ────────────────────────────────────────────────────────
# Each entry: (output_filename_stem, list_of_App::Part_label_substrings_to_include)
# Parts that match ANY substring in the list are merged into that group.
# Order matters for the scroll animation — first = drops in first.
LINK_GROUPS = [
    ("mount",  ["Assembly 2 <2>", "Assembly 2 <1>", "right holder", "left holder"]),
    ("link1",  ["Link 1"]),
    ("link2",  ["Link 2"]),
    ("link3",  ["Link 3"]),
    ("link4",  ["Link 4"]),
    ("link5",  ["Link 5"]),
    # Gripper / wrist end-effector — anything not captured above
    ("gripper", ["Assembly 3", "Assembly 4", "Assembly 11"]),
]

# Build a lookup: App::Part label → group name
app_parts = {o.Label: o for o in doc.Objects if o.TypeId == 'App::Part'}
print(f"[freecad] App::Part objects found: {list(app_parts.keys())}")

# Map each group to the App::Part objects that belong to it
group_parts = {stem: [] for stem, _ in LINK_GROUPS}
assigned = set()

for stem, patterns in LINK_GROUPS:
    for label, obj in app_parts.items():
        if label in assigned:
            continue
        for pat in patterns:
            if pat in label:
                group_parts[stem].append(obj)
                assigned.add(label)
                break

# Unassigned App::Parts (not the top-level arm root) go into "other"
unassigned = [obj for label, obj in app_parts.items()
              if label not in assigned and label not in ("Right Arm", "Left Arm", arm_label.title() + " Arm")]
if unassigned:
    group_parts["gripper"] = group_parts.get("gripper", []) + unassigned
    print(f"[freecad] Unassigned parts folded into gripper: {[o.Label for o in unassigned]}")

# ── export each group ────────────────────────────────────────────────────────
MESH_LINEAR   = 2.0   # mm linear deflection — web-optimised (0.5 gives 4x more triangles)
MESH_ANGULAR  = 0.5   # radians angular deflection

exported = []
for stem, _ in LINK_GROUPS:
    parts = group_parts.get(stem, [])
    if not parts:
        print(f"[freecad] {stem}: no parts found, skipping")
        continue

    all_shapes = []
    for part_obj in parts:
        all_shapes.extend(collect_shapes_recursive(part_obj))

    if not all_shapes:
        print(f"[freecad] {stem}: no solid shapes, skipping")
        continue

    print(f"[freecad] {stem}: meshing {len(all_shapes)} shapes ...")
    compound = Part.makeCompound([s for _, s in all_shapes])
    try:
        mesh = MeshPart.meshFromShape(
            Shape=compound,
            LinearDeflection=MESH_LINEAR,
            AngularDeflection=MESH_ANGULAR,
            Relative=False,
        )
    except Exception as e:
        print(f"[freecad] {stem}: mesh failed: {e}")
        continue

    out_path = os.path.join(output_dir, f"{stem}.obj")
    mesh.write(out_path)
    print(f"[freecad] {stem}: wrote {out_path}  ({mesh.CountFacets} facets)")
    exported.append((stem, out_path))

print(f"[freecad] Done. Exported {len(exported)} groups: {[s for s,_ in exported]}")
