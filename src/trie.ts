import { Node } from './node'
import { NormalizePattern } from './util'

export class Trie extends Node {
    constructor() {
        super(null)
    }

    add(pattern: string | (string | Lookup)[]) {
        const words = NormalizePattern(pattern)
    }

    remove() { }
    suggest() { }
}
