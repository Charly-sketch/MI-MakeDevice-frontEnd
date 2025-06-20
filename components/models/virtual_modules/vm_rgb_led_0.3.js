/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
TRANSFORMED!!!
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/models/virtual_modules/vm_rgb_led_0.3.glb')
  return (
    <group {...props} dispose={null} rotation={[Math.PI / 2, 0, Math.PI]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SHAPE_1_IndexedFaceSet.geometry}
        material={materials.PaletteMaterial001}
        position={[1.536, 5.502, 0.36]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={2.54}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.SHAPE_4206_IndexedFaceSet.geometry}
        material={materials.PaletteMaterial002}
        position={[-1.664, 0.177, 0.347]}
        rotation={[Math.PI / 2, 0, -Math.PI]}
        scale={2.54}
      />
    </group>
  )
}

useGLTF.preload('/models/virtual_modules/vm_rgb_led_0.3.glb')
