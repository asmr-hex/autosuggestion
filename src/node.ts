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

    public findMatching(tokens: Word[]): Match[] {
        let matches: Match[] = []

        // find matching paths from lookups
        for (const [alias, lookup] of Object.entries(this.next.lookup)) {
            matches = matches.concat(lookup.findMatching(tokens))
        }

        // okay, the list of matches could contain matches with remainders.

        // we want to try to resolve the matches that have remainders here by searching
        // words.
        // if there are results, we remove this entry and add the results instead.

        // now its time to search characters.

        return matches
    }
}
