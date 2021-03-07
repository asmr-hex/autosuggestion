import {
    Pattern,
    Word,
    Lookup,
} from './types'

import { Dictionary } from './dictionary'
import { Node } from './node'
import { LookupNode } from './lookup'
import { Suggestion } from './suggestion'
import { NormalizePattern } from './util'
import { isWord, isLookup } from './typegaurds'


export class Trie extends Node {

    constructor(readonly dictionary: Dictionary, patterns: Pattern[] = []) {
        super(null)

        // add provided patterns to our trie.
        for (const pattern of patterns) { this.add(pattern) }
    }

    public add(pattern: Word | Lookup | Pattern) {
        let words = NormalizePattern(pattern)

        if (words.length === 0) return

        // TODO validate pattern.
        // TODO handle empty strings as Words by skipping.
        // (gaurantees each word has at least one character)

        let node: Node = this

        // this ensures that the root node of the Trie does not have any next.chars
        // rather, the null root acts as the last char of the previous word in a pattern
        // this is a simplifying structure for the algorithm.
        if (isWord(words[0])) {
            ({ node, pattern: words } = this._addFirstCharOfNextWord(this, words))
        }

        this._add(node, words)
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

        // check if this node has already been made
        if (!(c in node.next.word)) node.next.word[c] = new Node(c)
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
        if (!node.next.char[c]) node.next.char[c] = new Node(c)
        if (word.length === 1 && isLastWord) node.next.char[c].end = true

        // recurse until all has been consumed.
        if (word.length > 1) return this._addChars(node.next.char[c], word.slice(1), isLastWord)

        return node.next.char[c]
    }

    private _addLookup(node: Node, lookup: Lookup, isLastWord: boolean = true): Node[] {
        let nodes: Node[] = []
        for (let [alias, contexts] of Object.entries(lookup)) {
            // normalize contexts to always be an array
            if (!Array.isArray(contexts)) contexts = [contexts]

            let tries: Trie[] = []
            for (const context of contexts) {
                const trie = this.dictionary.contexts.get(context)
                if (!trie) throw new Error(`No such context '${context}'`) // TODO make this a type
                tries.push(trie)
            }

            const lookupNode = new LookupNode(alias, tries)
            if (isLastWord) lookupNode.end = true
            node.next.lookup[alias] = lookupNode
            nodes.push(lookupNode)
        }

        return nodes
    }

    public remove(pattern: Pattern) { }

    public suggest(input: Word | Word[]): Suggestion[] {
        let suggestions: Suggestion[] = []

        // normalize input to be an array (if only given a string)
        if (!Array.isArray(input)) input = [input]

        for (const match of this.matchPattern(input).filter(m => m.remainder.length === 0).map(m => m.node)) {
            suggestions = suggestions.concat(match.completePattern(input))
        }

        return suggestions
    }
}
