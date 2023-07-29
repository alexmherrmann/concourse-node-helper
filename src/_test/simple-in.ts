import { wrapIn } from "../common"


wrapIn<{ numba: string} >(async (input) => {

    const { numba } = input.source
    const { ref } = input.version

    return {
        version: {
            ref: ref + numba
        },
        metadata: [
            {
                name: "woah",
                value: "dude"

            }
        ]
    }
})()