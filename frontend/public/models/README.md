# 3D Model Integration

Place your exported Blender .glb file here:

  /public/models/recovery-model.glb

## Export from Blender

1. File → Export → glTF 2.0
2. Select "Binary (.glb)" format
3. Check: Include → Selected Objects (or All)
4. Check: Mesh → Apply Modifiers
5. Export to this folder as `recovery-model.glb`

## Three.js Integration (ThreeDViewer)

Once your .glb is in place, replace `ViewerPlaceholder.tsx` with a
Three.js canvas component. The GLTFLoader and OrbitControls are ready
to import from the `three` npm package already installed:

  import { GLTFLoader }    from 'three/examples/jsm/loaders/GLTFLoader'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

The viewer controls (zoom, rotate, reset) in ViewerPlaceholder.tsx
are already wired to onClick handlers — just connect them to your
Three.js camera/controls instance.
