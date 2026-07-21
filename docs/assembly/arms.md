# Arm Integration

![Leader and follower arm joint correspondence](../images/arms_leader_follower.png){ width=360 .center }

## General Motor Setup

Before assembling either arm variant, each Dynamixel servo must be configured with a unique ID and the correct baud rate. This is done using the [Dynamixel Wizard 2.0](https://docs.robotis.com/docs/software/dynamixel_wizard_2_0/introduction/).

### Installing Dynamixel Wizard 2.0

Download and install Dynamixel Wizard 2.0 from the [ROBOTIS website](https://docs.robotis.com/docs/software/dynamixel_wizard_2_0/introduction/). Connect your U2D2 interface board to your computer via USB. Note that all motors except the XL-330 require 12 V power through the power circuit while the XL-330 requires installation of the 5 V stepdown converter before being plugged in.

### Preparing the XL-330 (5V Stepdown)

The XL-330 servo operates at 5V, while the rest of the motor chain runs at 12V. A 5V stepdown converter must be installed on the link before the holder (for both leader arm variants) in the chain before connecting it to power.

1. Cut the end of the wire that will come out of the motor preceding the XL-330. Cut another Dynamixel connector in the same way, which will be used from the converter and signal line to the XL-330. You will need to cut through the signal line as well.
2. Use the [ENGINEER PA-09 crimper](../bom.md#engineer-pa09) to attach JST crimps from the [JST XH 2.54mm connector kit](../bom.md#jst-xh-kit) to the ground and power lines of the incoming motor \(V_{in}\). Slot them into the 2-pin female pin housing, connecting to VIN and GND on the converter.
3. Wire the stepdown converter inline. 12V in from the upstream motor ([XM430-W350](https://docs.robotis.com/docs/dxl/model_reference/x_series/xm_series/xm430-w350) for ARX5, [XM430-W210](https://docs.robotis.com/docs/dxl/model_reference/x_series/xm_series/xm430-w210) for RB-Y1m), 5V out to the XL-330 power pin. Refer to the [XL-330 e-manual](https://docs.robotis.com/docs/dxl/model_reference/x_series/xl_series/xl330-m288) for pinout details. Connect the signal line to one end of a [WAGO connector](../bom.md#wago).
4. Use the [pre-crimped cables](../bom.md#jst-wire-kit) with the 2-pin housing to connect to \(V_{out}\) and GND on the converter. On the other end of the cable, connect another 2-pin housing.
5. Using the second Dynamixel connector that has the header cut off, use the [ENGINEER PA-09 crimper](../bom.md#engineer-pa09) to attach JST crimps from the [JST XH 2.54mm connector kit](../bom.md#jst-xh-kit) to the ground and power lines of what will become the line to the XL-330 motor. Attach a 2-pin male header to the ground and power lines, connecting this to the female 2-pin out from the converter \(V_{out}\) and GND. Connect the remaining signal line to the other end of the [WAGO connector](../bom.md#wago).
6. Mount the board on the last link before the holder (applies to either arm) with [M2x6 screws](../bom.md#m2x6-screw) and the [M2 heat-set inserts](../bom.md#m2-heat-set).



<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75em;margin:1em 0;">
  <div style="text-align:center;font-size:0.8em;color:#555;"><img src="../../images/top_view_converter.jpg" style="width:100%;max-height:200px;object-fit:contain;border-radius:4px;"><br>Top view</div>
  <div style="text-align:center;font-size:0.8em;color:#555;"><img src="../../images/bottom_view_converter.jpg" style="width:100%;max-height:200px;object-fit:contain;border-radius:4px;"><br>Bottom view</div>
</div>
<div style="text-align:center;font-size:0.8em;color:#555;margin:0.75em 0 1em;">
  <img src="../../images/converter_wiring.png" style="width:100%;max-height:350px;object-fit:contain;border-radius:4px;"><br>Wiring
</div>

### Setting Motor IDs

Motors must be assigned unique IDs so the arm controller can address each joint individually. It is easiest to configure one motor at a time.

1. Open Dynamixel Wizard 2.0 and click **Scan** to detect the connected motor.
2. Select the motor from the device list.
3. In the control table, find the **ID** field and set it to the desired joint number. Refer to the arm-specific section below for the correct ID assignment per joint.
4. Click **Save** to write the value to the motor.
5. Disconnect the motor and repeat for the next one.

*<!-- Add screenshot of Dynamixel Wizard with motor selected and ID field highlighted -->*

### Setting Baud Rate

All motors must be set to the same baud rate used by the arm controller.

1. With the motor connected and detected, find the **Baud Rate** field in the control table.
2. Set the baud rate to **1000000 (1 Mbps)**.
3. Click **Save**.

*<!-- Add screenshot of baud rate field in control table -->*

### Attaching Servo Horns

Before inserting motors into 3D-printed links, attach the servo horn to the motor output shaft.

1. Align the servo horn with the spline on the output shaft. The horn is keyed so it will only fit in one orientation, so do not force it.
2. Press the horn firmly onto the shaft until it is fully seated.
3. Secure with the included horn screw.

*<!-- Add photo of horn attachment -->*

---

## 3D Prints

### ARX5 Leader Arm (6-DoF)

<div class="stl-grid">
  <div class="stl-card"><a href="../../images/bom/part-shoulder.png"><img src="../../images/bom/part-shoulder.png"></a><span class="stl-card-name">Right Shoulder</span><span class="stl-card-links"><a href="../../files/arx5/right-shoulder.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-shoulder2.png"><img src="../../images/bom/part-shoulder2.png"></a><span class="stl-card-name">Left Shoulder</span><span class="stl-card-links"><a href="../../files/arx5/left-shoulder.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-link1.png"><img src="../../images/bom/part-link1.png"></a><span class="stl-card-name">Link 1</span><span class="stl-card-links"><a href="../../files/arx5/link1.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-link2.png"><img src="../../images/bom/part-link2.png"></a><span class="stl-card-name">Link 2</span><span class="stl-card-links"><a href="../../files/arx5/link2.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-link3.png"><img src="../../images/bom/part-link3.png"></a><span class="stl-card-name">Link 3</span><span class="stl-card-links"><a href="../../files/arx5/link3.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-link4.png"><img src="../../images/bom/part-link4.png"></a><span class="stl-card-name">Link 4</span><span class="stl-card-links"><a href="../../files/arx5/link4.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-link5.png"><img src="../../images/bom/part-link5.png"></a><span class="stl-card-name">Link 5</span><span class="stl-card-links"><a href="../../files/arx5/link5.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-gripper.png"><img src="../../images/bom/part-gripper.png"></a><span class="stl-card-name">Gripper (×2)</span><span class="stl-card-links"><a href="../../files/arx5/right-gripper.step" download>STEP (R)</a><a href="../../files/arx5/left-gripper.step" download>STEP (L)</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-trigger.png"><img src="../../images/bom/part-trigger.png"></a><span class="stl-card-name">Trigger (×2)</span><span class="stl-card-links"><a href="../../files/shared/trigger-right.step" download>STEP (R)</a><a href="../../files/shared/trigger-left.step" download>STEP (L)</a></span></div>
</div>

### Motor Assembly and Setup (ARX5)

<div class="slideshow">
  <div class="slide">
    <div class="slide-label">Shoulder <small>(left + right versions)</small></div>
    <img src="../../images/ARX_Instructions/shoulder_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 1</div>
    <img src="../../images/ARX_Instructions/link_1_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 2</div>
    <img src="../../images/ARX_Instructions/link_2_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 3</div>
    <img src="../../images/ARX_Instructions/link_3_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 4</div>
    <img src="../../images/ARX_Instructions/link_4_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 5</div>
    <img src="../../images/ARX_Instructions/link_5_instructions.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Holder <small>(left + right versions)</small></div>
    <img src="../../images/ARX_Instructions/holder_instructions.png" width="600">
  </div>
  <div class="slide-controls">
    <button class="slide-prev">&#8592;</button>
    <span class="slide-counter"></span>
    <button class="slide-next">&#8594;</button>
  </div>
</div>

### Full Arm Assembly (ARX5)

<canvas class="model-viewer" data-model="../../models/arms/arx_arm.glb" style="width:100%;max-width:500px;height:400px;border-radius:8px;display:block;margin:0 auto;"></canvas>

With all links pre-loaded with motors, assemble the arm starting from the shoulder and working outward to the holder. Use M2.5x4 screws included with each motor and hinge for all the hinge connections. For the holder connections, use [M2x6 screws](../bom.md#m2x6-screw). Refer to the 3D model above for screw placement. Left arm is mirrored for motor direction.

!!! note "Note"
    We provide assembly instructions for the default URDF and joint signs used in the paper and repo. Changes in motor assembly require updates in their respective files and re-export. 

---

### RB-Y1m Leader Arm (7-DoF)

<div class="stl-grid">
  <div class="stl-card"><a href="../../images/bom/part-rby1m-shoulder-right.png"><img src="../../images/bom/part-rby1m-shoulder-right.png"></a><span class="stl-card-name">Right Shoulder</span><span class="stl-card-links"><a href="../../files/rby1m/right-shoulder.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-shoulder-left.png"><img src="../../images/bom/part-rby1m-shoulder-left.png"></a><span class="stl-card-name">Left Shoulder</span><span class="stl-card-links"><a href="../../files/rby1m/left-shoulder.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link1.png"><img src="../../images/bom/part-rby1m-link1.png"></a><span class="stl-card-name">Link 1</span><span class="stl-card-links"><a href="../../files/rby1m/link1.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link2.png"><img src="../../images/bom/part-rby1m-link2.png"></a><span class="stl-card-name">Link 2</span><span class="stl-card-links"><a href="../../files/rby1m/link2.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link3.png"><img src="../../images/bom/part-rby1m-link3.png"></a><span class="stl-card-name">Link 3</span><span class="stl-card-links"><a href="../../files/rby1m/link3.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link4.png"><img src="../../images/bom/part-rby1m-link4.png"></a><span class="stl-card-name">Link 4</span><span class="stl-card-links"><a href="../../files/rby1m/link4.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link5.png"><img src="../../images/bom/part-rby1m-link5.png"></a><span class="stl-card-name">Link 5</span><span class="stl-card-links"><a href="../../files/rby1m/link5.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-link6.png"><img src="../../images/bom/part-rby1m-link6.png"></a><span class="stl-card-name">Link 6</span><span class="stl-card-links"><a href="../../files/rby1m/link6.step" download>STEP</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-rby1m-gripper.png"><img src="../../images/bom/part-rby1m-gripper.png"></a><span class="stl-card-name">Gripper (×2)</span><span class="stl-card-links"><a href="../../files/rby1m/right-gripper.step" download>STEP (R)</a><a href="../../files/rby1m/left-gripper.step" download>STEP (L)</a></span></div>
  <div class="stl-card"><a href="../../images/bom/part-trigger.png"><img src="../../images/bom/part-trigger.png"></a><span class="stl-card-name">Trigger (×2)</span><span class="stl-card-links"><a href="../../files/shared/trigger-right.step" download>STEP (R)</a><a href="../../files/shared/trigger-left.step" download>STEP (L)</a></span></div>
</div>

### Motor Assembly and Setup (RB-Y1m)

<div class="slideshow">
  <div class="slide">
    <div class="slide-label">Shoulder <small>(left + right versions)</small></div>
    <img src="../../images/RBY1_Instructions/shoulder_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 1</div>
    <img src="../../images/RBY1_Instructions/link_1_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 2</div>
    <img src="../../images/RBY1_Instructions/link_2_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 3</div>
    <img src="../../images/RBY1_Instructions/link_3_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 4</div>
    <img src="../../images/RBY1_Instructions/link_4_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 5</div>
    <img src="../../images/RBY1_Instructions/link_5_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Link 6</div>
    <img src="../../images/RBY1_Instructions/link_6_instructions_rby1.png" width="600">
  </div>
  <div class="slide">
    <div class="slide-label">Holder <small>(left + right versions)</small></div>
    <img src="../../images/RBY1_Instructions/holder_instructions_rby1.png" width="600">
  </div>
  <div class="slide-controls">
    <button class="slide-prev">&#8592;</button>
    <span class="slide-counter"></span>
    <button class="slide-next">&#8594;</button>
  </div>
</div>

### Full Arm Assembly (RB-Y1m)

<canvas class="model-viewer" data-model="../../models/arms/rby1m_arm.glb" data-cam-x="-0.3" data-cam-y="0.8" data-cam-z="1.4" style="width:100%;max-width:500px;height:400px;border-radius:8px;display:block;margin:0 auto;"></canvas>

With all links pre-loaded with motors, assemble the arm starting from the shoulder and working outward to the holder. Use M2.5x4 screws included with each motor and hinge for all the hinge connections. For the holder connections, use M2x3 screws from the [FR-12 Bracket Kit](../bom.md#fr12-bracket-kit). Refer to the 3D model above for screw placement. Left arm is mirrored for motor direction.

!!! note "Note"
    We provide assembly instructions for the default URDF and joint signs used in the paper and repo. Changes in motor assembly require updates in their respective files and re-export. 

