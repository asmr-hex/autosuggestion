import { Context } from './types'

import { Trie } from './trie'


export class Dictionary {
    contexts: Map<Context, Trie>

    constructor() {
        this.contexts = new Map()
    }
}
