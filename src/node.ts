

export class Node {
    end: boolean
    next: NextNodes

    constructor(readonly value: Value) {
        this.end = false
        this.next = {
            char: new Map(),
            word: null,
            lookup: new Map()
        }
    }
}
