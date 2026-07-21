#!/usr/bin/env bash
# export_arms.sh — converts arm STEP files → per-link GLBs via FreeCAD + obj2gltf
#
# Usage: ./scripts/export_arms.sh
# Outputs: models/arm_right/ and models/arm_arx/  (GLB per link + assembly_offsets.json)
#
# Requirements:
#   - FreeCAD 1.x at /Applications/FreeCAD.app
#   - npx (obj2gltf installed on demand)

set -euo pipefail

FREECAD="/Applications/FreeCAD.app/Contents/Resources/bin/freecadcmd"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MODELS_DIR="$REPO_ROOT/models"
TMP_BASE="/tmp/arm_export"

# ── input STEP files ─────────────────────────────────────────────────────────
RIGHT_ARM_STEP="$HOME/Downloads/Right Arm.step"
ARX_STEP="$HOME/Downloads/ARX Version.step"

# ── output directories ────────────────────────────────────────────────────────
RIGHT_DIR="$MODELS_DIR/arm_right"
ARX_DIR="$MODELS_DIR/arm_arx"
TMP_RIGHT="$TMP_BASE/right"
TMP_ARX="$TMP_BASE/arx"

mkdir -p "$RIGHT_DIR" "$ARX_DIR" "$TMP_RIGHT" "$TMP_ARX"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ModPack arm export pipeline"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Step 1: STEP → OBJ (FreeCAD headless) ────────────────────────────────────
echo ""
echo "▶ [1/3] Exporting Right Arm STEP → OBJ …"
# freecadcmd doesn't support sys.argv passthrough, so we generate wrapper scripts
cat > /tmp/fc_export_right.py << PYEOF
import sys, os
sys.argv = ["export_arms.py", "$RIGHT_ARM_STEP", "$TMP_RIGHT", "right"]
exec(open("$SCRIPT_DIR/export_arms.py").read())
PYEOF
"$FREECAD" /tmp/fc_export_right.py 2>&1 | grep "\[freecad\]" || true

echo ""
echo "▶ [1/3] Exporting ARX Version STEP → OBJ …"
cat > /tmp/fc_export_arx.py << PYEOF
import sys, os
sys.argv = ["export_arms.py", "$ARX_STEP", "$TMP_ARX", "arx"]
exec(open("$SCRIPT_DIR/export_arms.py").read())
PYEOF
"$FREECAD" /tmp/fc_export_arx.py 2>&1 | grep "\[freecad\]" || true

# ── Step 2: OBJ → GLB (obj2gltf via npx) ─────────────────────────────────────
echo ""
echo "▶ [2/3] Converting OBJ → GLB …"

convert_dir() {
  local obj_dir="$1"
  local glb_dir="$2"
  local variant="$3"

  for obj_file in "$obj_dir"/*.obj; do
    [ -f "$obj_file" ] || continue
    stem="$(basename "$obj_file" .obj)"
    glb_file="$glb_dir/${stem}.glb"
    echo "    $variant/$stem.obj → $stem.glb"
    npx --yes obj2gltf -i "$obj_file" -o "$glb_file" 2>/dev/null
  done
}

convert_dir "$TMP_RIGHT" "$RIGHT_DIR" "right"
convert_dir "$TMP_ARX"   "$ARX_DIR"   "arx"

# ── Step 3: Generate assembly_offsets.json ────────────────────────────────────
echo ""
echo "▶ [3/3] Writing assembly_offsets.json templates …"

write_offsets() {
  local dir="$1"
  local out="$dir/assembly_offsets.json"

  # Build list of exported stems in order
  stems=()
  for f in "$dir"/*.glb; do
    [ -f "$f" ] || continue
    stems+=("$(basename "$f" .glb)")
  done

  python3 - "$out" "${stems[@]}" << 'PYEOF'
import sys, json

out_path = sys.argv[1]
stems    = sys.argv[2:]

# Drop offset: straight down from 800 units above assembled position.
# assembled_pos is [0,0,0] as a placeholder — tune after loading in Three.js.
# The scroll animation lerps each link from (assembled_pos + drop_offset) → assembled_pos.
links = []
for i, stem in enumerate(stems):
    links.append({
        "id":           i,
        "stem":         stem,
        "label":        stem.replace("_", " ").title(),
        "assembled_pos": [0, 0, 0],    # PLACEHOLDER — update after aligning in scene
        "drop_offset":  [0, 800, 0],   # world-units above final position
        "color":        "#ffffff"       # override per-part if desired
    })

with open(out_path, "w") as f:
    json.dump(links, f, indent=2)
print(f"    wrote {out_path}")
PYEOF
}

write_offsets "$RIGHT_DIR"
write_offsets "$ARX_DIR"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done! GLBs written to:"
echo "    $RIGHT_DIR"
echo "    $ARX_DIR"
echo ""
echo "  Next steps:"
echo "  1. Open the site locally and load the GLBs in _3d_test.html"
echo "  2. Note each link's actual position/bbox to fill in assembled_pos"
echo "     in the assembly_offsets.json files"
echo "  3. Run the scroll animation implementation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
