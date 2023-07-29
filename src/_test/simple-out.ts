import { wrapOut } from "../common";


wrapOut<{numba: string}>(async (input) => {

    const { numba } = input.source
    const { ref } = input.version

    const newRef = parseInt(ref) + 1
    return {
        version: {
            ref: newRef.toString()
        },

    }
})()