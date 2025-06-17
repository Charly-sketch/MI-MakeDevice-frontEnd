
export const isAncestor = (objToCheck: THREE.Object3D, objSel: THREE.Object3D): boolean => {
    objSel.traverse(child => {
        if (child.uuid === objToCheck.uuid){
            return true;
        }
    })

    return false;
}