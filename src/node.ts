import { Word, NextNodes, Value } from './types'

/**
 * **NOTE:** a valid [[Match]] with a `remainder` can **only** occur if the partial match 
 * occurs at a word boundary (i.e., the [[Node | node]] contained in the [[Match| match]]
 * has `end === true`). This is due to the fact that the API for defining a [[Pattern | pattern]]
 * does not support concatenating a lookup result and char sequences into a single word. E.g.,
 * a pattern such as `<some_lookup_context>s` to make a lookup result plural is not supported.
 */
export interface Match {
    node: Node
    remainder: Word[]
}

export class Node {
    end: boolean
    next: NextNodes

    constructor(readonly value: Value) {
        this.end = false
        this.next = { char: {}, word: {}, lookup: {} }
    }

    /**
     * Given an input sequence of words, a starting [[Node | node]], and
     * a [[Dictionary | dictionary]], finds all valid matching paths that
     * the input satisfies.
     * 
     * #### Simple Example
     * If we have a starting node which yields the following
     * sub-trie,
     * ```
     * t - r - i - e
     *       \
     *         e - e
     * ```
     * and input *"tr"*, the returned node will be *"r"*.
     *
     * #### Advanced Example
     * With a more complex starting trie,
     * ```
     * null - a - b - c -   - d (1)
     *      \
     *        <X> -   - d (2)
     *
     * <X>: null - a - b - c
     *           \ 
     *             <Y>
     *
     * <Y>: null - a - b - c -   - d (3)
     * ```
     * given **"abc d"**, it wll return the **"d"** [[Node | nodes]] labeled
     * _(1)_, _(2)_, _(3)_
     * 
     * Since patterns can span multiple levels of nested contexts, we need to return
     * not only the matched words (partially matched on completed words), but also the
     * remainder of the match. This way, we can check for matches in parent contexts in
     * case a pattern satisfies a match over an arbitrary number of contextual levels.
     */
    public matchPattern(tokens: Word[]): Match[] {
        if (tokens.length === 0) return []

        let matches: Match[] = []

        // find matching paths from lookups
        for (const [alias, lookup] of Object.entries(this.next.lookup)) {
            matches = matches.concat(lookup.matchPattern(tokens))
        }

        return matches.concat(this.matchWord(tokens))
    }

    public matchWord(tokens: Word[]): Match[] {
        const word = this.next.word[tokens[0][0]]
        if (!word) return []

        const node = word.matchChars(tokens[0])
        if (!node) return []

        const match = { node, remainder: tokens.slice(1) }

        // (1) if there are no remainders keep searching. include match in results if it is a terminal.
        // (2) if there are no remainders, return this single match (regardless of if it isa terminal).
        return match.remainder.length > 0
            ? (node.end ? [match] : []).concat(node.matchPattern(match.remainder))  // (1)
            : [match]                                                               // (2)
    }

    /**
     * Given an word, returns the final node which matches the complete word. null otherwise.
     */
    public matchChars(word: Word): Node | null {
        if (this.value !== word[0]) return null

        let node: Node = this
        word = word.substr(1)

        while (word) {
            node = node.next.char[word[0]]
            if (!node) return null
            word = word.substr(1)
        }

        return node
    }
}
