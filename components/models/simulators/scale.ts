export const scale = (number, [inMin, inMax], [outMin, outMax]) => {
    // if you need an integer value use Math.floor or Math.ceil here
    return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}