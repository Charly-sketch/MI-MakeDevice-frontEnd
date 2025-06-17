import dynamic from "next/dynamic";



const DynamicConnect = dynamic(() => import('./Connect'), {ssr: false})

export default function ConnectComp() {
    return <DynamicConnect/>
}
