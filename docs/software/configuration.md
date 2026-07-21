# Configuration

ModPack uses two YAML config files: a global networking config (`modpack_config.yaml`) and a per-robot hardware and runtime config (`robots/<name>/config.yaml`).

!!! note "Reference"
    The full key reference for both config files lives in the code repo:
    [README]({{ repo_blob }}/README.md) ·
    [robots/README]({{ repo_blob }}/modpack/robots/README.md) ·
    [orchestration/README]({{ repo_blob }}/modpack/orchestration/README.md)

## `modpack_config.yaml`

Lives at `modpack/modules/modpack_config.yaml` and controls RMQ server networking across all robots.

## `modpack/robots/<name>/config.yaml`

Lives at `modpack/robots/<name>/config.yaml`. Controls all robot-specific hardware and runtime behavior.

### GELLO Hardware (`gello` key)

!!! note "Reference"
    GELLO module internals (RMQ topics, lifecycle): [gello/README]({{ repo_blob }}/modpack/modules/gello/README.md).

#### Port Configuration

As indicated by the [Gello readme](https://github.com/haoyu-x/vision-in-action/blob/1588edb2ed4e4fb8f19562d3a36e4e8cb993b4e5/data_collection/gello_software/README.md), you can find the path to the U2D2 once you plug into the ModPack mini PC by using `ls /dev/serial/by-id`, where the device should be in the form `usb-FTDI_USB__-__Serial_Converter`. The `baudrate` parameter should match what you have set in the Dynxamixel Wizard 2.0

#### Motor Configuration

Zero position offsets/robot joint signs and joint offsets/joint signs are all crucial for safe and correct control of any target robot. They serve two distinct purposes.

- `zero_position_offsets`/`robot_joint_signs`: Accounts for the difference between URDF and arm zero position, enabling accurate gravity compensation. Unless you use different URDFs from those provided, this does not need to change.
- `joint_offsets`/`joint_signs`: Accounts for difference between installed motor zero and robot zero positions and directionality of motors. Ideally these are zero, but are left in to account for any offset as to not make people re-install motors. These offsets need to be calibrated for each setup.

!!! warning
    Do not run teleoperation without first calibrating the joint offsets. For joint signs, only change as needed.

To calibrate joint offsets for either arm, use the script `zero_calib.py`. This will also calibrate the gripper open and close angles, which are necessary to account for installation angle.

!!! note "Reference"
    Usage and steps: [scripts/calibration/README]({{ repo_blob }}/scripts/calibration/README.md).

#### Current Limits
Per-motor current limits bound motor output to ensure safe gravity compensation and reasonable haptic feedback. Each arm motor has a `current_limit` (the overall ceiling), plus separate `gravity_current_limit` and `contact_current_limit` budgets for gravity compensation and haptic contact feedback; these are converted to torque internally using the motor's torque constant. The gripper, which is position-controlled, has only a `current_limit`. We have set up limits that are comfortable for our purposes, but users are free to tune these parameters within reason, noting the maximum current allowed per motor and the maximum total current the battery setup is able to provide.

#### Control Parameters

Control parameters such as `kp` and `kd` are set to reasonable values for gravity compensation, but users are free to tune.

### Logging Streams

!!! note "Reference"
    Logging-stream config: [modpack/modules/logger/README]({{ repo_blob }}/modpack/modules/logger/README.md).
