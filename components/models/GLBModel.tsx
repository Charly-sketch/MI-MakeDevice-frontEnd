import React from "react"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Suspense } from "react"
//import Suspense from "../ui/Suspense"

export default function GLBModel(props: { name: string }) {
    const { name } = props
    const obj = useLoader(GLTFLoader, `../public/models/${name}.glb`)
    return (
        <Suspense>
            <primitive object={obj.scene} />
        </Suspense>
    )
}
