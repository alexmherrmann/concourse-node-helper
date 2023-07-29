import { wrapCheck } from "../common";


wrapCheck<{ numba: string} >(async (input) => {

    const numba = parseInt(input.source.numba)

    const arr = Array(numba).fill(0)
    
    arr.forEach((_, i, a) => a[i] = i)

    return arr.map((i) => {
        return {
            ref: i.toString()
        }
    })
})()