import { Word, Context, Pattern } from './types'

import { Trie } from './trie'
import { Suggestion } from './suggestion'


export class Dictionary {
    public contexts: Map<Context, Trie> = new Map()

    constructor(public lookahead = 0) { }

    define(context: Context, patterns: Pattern[] = []): Trie {
        const trie: Trie = new Trie(this, patterns)
        this.contexts.set(context, trie)
        return trie
    }

    add(context: Context, patterns: Pattern[]) {
        // TODO make it optional to pass in a Word | Lookup | Pattern | Pattern []
        const trie = this.contexts.get(context)
        if (!trie) return
        for (const pattern of patterns) {
            trie.add(pattern)
        }
    }

    remove(context: Context, patterns: Pattern[]) {
        // TODO make it optional to pass in a Word | Lookup | Pattern | Pattern []
        const trie = this.contexts.get(context)
        if (!trie) return
        for (const pattern of patterns) {
            trie.remove(pattern)
        }
    }

    suggest(tokens: Word | Word[], contexts: Context[] = []): Suggestion[] {
        let suggestions: Suggestion[] = []
        if (contexts.length === 0) contexts = Array.from(this.contexts.keys())

        for (const context of contexts) {
            const trie = this.contexts.get(context)
            if (!trie) continue
            suggestions = suggestions.concat(trie.suggest(tokens, this.lookahead))
        }

        return suggestions
    }
}
