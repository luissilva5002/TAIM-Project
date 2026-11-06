# 3D UI Teleportation Sandbox

Three.js sandbox comparing two teleport modes (ground arc / air vector),
driven from PC controls or a simulated Flutter companion app.

## Run
ES modules need http (not file://):

    cd teleport-sandbox
    python3 -m http.server 8000     # then open http://localhost:8000

## Structure

    index.html                  markup + CDN scripts (Tailwind, Three r128, Lucide)
    css/styles.css              glass panels, neon text, joystick, slider
    js/
      main.js                   entry: init order + resize
      config.js                 all tunable constants and level layout
      core/
        state.js                `state` (gameplay data) + `engine` (live Three objects)
        loop.js                 render/animation loop
      scene/
        setup.js                scene, camera, renderer, lights, ground, resize/reset
        environment.js          pillars, sky platforms, air rings, starfield
      teleport/
        visualizers.js          parabola, reticle, air laser, ghost sphere
        trajectory.js           per-frame aim: ground arc raycast / air vector
        execute.js              warp animation + stats update
      input/
        pcControls.js           mouse drag, wheel, keyboard (version 1)
        companionControls.js    aim pad, slider, buttons (version 2)
      ui/
        hud.js                  altitude, jump stats, status badge, depth sync
        modeSwitch.js           GROUND/AIR mode UI + data table
        panels.js               phone toggle, Flutter guide modal
        speedOverlay.js         warp speed-line canvas

## Dependency direction
main -> (scene | teleport | input | ui | core) -> core/state + config
Input and teleport call into ui; ui never imports input.
