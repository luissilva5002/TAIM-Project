# 3D UI Teleportation Sandbox - Method 2 (keyboard only)

Same scene, HUD and teleport logic as Method 1, but every action is on the keyboard.
No mouse, wheel or touch input is registered. A keyboard visualizer (Input Monitor) shows live key state.

Run (ES modules need http):  python3 -m http.server 8000  ->  http://localhost:8000

## Keys
    Arrow keys      aim yaw / pitch (hold)
    Shift           fine aim + fine depth (hold)
    W / S           target depth +/-
    Space / Enter   teleport
    G / F           ground arc / air mode
    R               reset camera
    P               toggle Input Monitor

## Input Monitor (replaces the Flutter phone mirror)
    keycaps    light up while pressed
    compass    yaw heading; bar shows pitch
    gauge      target depth 3-50 m
    badges     active mode
js/ui/inputMonitor.js drives it every frame. The Flutter guide modal was removed.
