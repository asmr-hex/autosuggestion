import { NextNodes, Value } from './types'

export class Node {
    end: boolean
    next: NextNodes

    constructor(readonly value: Value) {
        this.end = false
        this.next = {
            char: {},
            word: {},
            lookup: {},
        }
    }
}
