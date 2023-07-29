import { wrapOut } from "../common";


wrapOut<{numba: string}>(async (input) => {

    const { numba } = input.source
    const { ref } = input.version

    const newRef = parseInt(ref) + 1

    process.stderr.write(`newRef: ${newRef}`)
    return {
        version: {
            ref: newRef.toString()
        },

    }
})()