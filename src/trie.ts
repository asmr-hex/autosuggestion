import {
    Pattern,
    Word,
    Lookup,
} from './types'

import { Node } from './node'
import { LookupNode } from './lookup'
import { Suggestion } from './suggestion'
import { NormalizePattern } from './util'
import { isWord, isLookup } from './typegaurds'


export class Trie extends Node {

    constructor(patterns: Pattern[] = []) {
        super(null)

        // add provided patterns to our trie.
        for (const pattern of patterns) { this.add(pattern) }
    }

    public add(pattern: Word | Lookup | Pattern) {
        const words = NormalizePattern(pattern)
        // TODO validate pattern.
        // TODO handle empty strings as Words by skipping.
        // (gaurantees each word has at least one character)


        this._add(this, words)
    }

    private _add(node: Node, pattern: Pattern, isLastWord: boolean = false) {
        if (pattern.length === 0) return
        if (pattern.length === 1) isLastWord = true

        let nextNodes: Node[] = []
        let next: Word | Lookup = pattern[0]
        if (isWord(next)) nextNodes = [this._addChars(node, next, isLastWord)]
        if (isLookup(next)) nextNodes = this._addLookup(node, next, isLastWord)

        if (isLastWord) return

        pattern = pattern.slice(1)
        next = pattern[0]
        for (let nextNode of nextNodes) {
            let nextPattern = pattern
            if (isWord(next)) {
                const result = this._addFirstCharOfNextWord(nextNode, pattern)
                nextNode = result.node
                nextPattern = result.pattern
            }

            this._add(nextNode, nextPattern)
        }
    }

    private _addFirstCharOfNextWord(node: Node, pattern: Pattern): { node: Node, pattern: Pattern } {
        const word = pattern[0] as Word
        const c = word[0]

        node.next.word[c] = new Node(c)
        node = node.next.word[c]

        if (word.length === 1 && pattern.length === 1) {
            node.end = true
            return { node, pattern: [] }
        }

        pattern = ([word.substr(1)] as Pattern).concat(pattern.slice(1))

        return { node, pattern }
    }

    private _addChars(node: Node, word: Word, isLastWord: boolean = true): Node {
        if (word.length === 0) return node
        const c: string = word[0]
        if (!node.next.char[c]) {
            node.next.char[c] = new Node(c)
            if (word.length === 1 && isLastWord) node.next.char[c].end = true
        }

        // recurse until all has been consumed.
        if (word.length > 1) return this._addChars(node.next.char[c], word.slice(1), isLastWord)

        return node.next.char[c]
    }

    private _addLookup(node: Node, lookup: Lookup, isLastWord: boolean = true): Node[] {
        let nodes: Node[] = []
        for (let [alias, contexts] of Object.entries(lookup)) {
            // normalize contexts to always be an array
            if (!Array.isArray(contexts)) contexts = [contexts]

            const lookupNode = new LookupNode(alias, contexts)
            if (isLastWord) lookupNode.end = true
            node.next.lookup[alias] = lookupNode
            nodes.push(lookupNode)
        }

        return nodes
    }

    public remove() { }

    public suggest(input: Word | Word[], dictionary = null): Suggestion[] {
        let suggestions: Suggestion[] = []

        // normalize input to be an array (if only given a string)
        if (!Array.isArray(input)) input = [input]

        for (const match of this.findMatches(input, this, dictionary)) {
            suggestions = suggestions.concat(this.complete(match, input))
        }

        return suggestions
    }

    /*
     */
    private findMatches(input: Word[], node: Node, dictionary = null): Node[] {

        return []
    }

    private complete(node: Node, input: Word[]): Suggestion[] {
        return []
    }
}
