import { Node } from './node'
import { NormalizePattern } from './util'


export class Trie extends Node {

    constructor(patterns: Pattern[] = []) {
        super(null)

        // add provided patterns to our trie.
        for (const pattern of patterns) { this.add(pattern) }
    }

    add(pattern: string | LookupObject | Lookup | Pattern | InputPattern) {
        const words = NormalizePattern(pattern)
        console.log(words)
    }

    remove() { }
    suggest() { }
}
