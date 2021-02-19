

export class Node {
    value: Value
    end: boolean
    next: NextNodes

    constructor(value: Value) {
        this.value = value
        this.end = false
        this.next = { char: new Map(), word: new Map() }
    }
}
