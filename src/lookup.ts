import { Word } from './types'
import { Node, Match } from './node'


export class LookupNode extends Node {
    constructor(alias: string, readonly contexts: Node[]) {
        super(alias)
    }

    /**
     * Given a sequence of tokens, returns a list of the greatest common nodes in a pattern
     * and their corresponding remainders (see [[Node.matchPattern]] and [[Match]] for details).
     * 
     * However, unlike [[Node.matchPattern]], this method attempts to resolve any results with
     * remainders at this contextual-level. That is, if a result from a `matchPattern` call on
     * a sub-context has remainders, this method will attempt to extend the match by trying to
     * match the remainder token sequence with the subsequent words in the pattern.
     *
     * @param tokens input tokens we wish to pattern match.
     */
    public matchPattern(tokens: Word[]): Match[] {
        let matches: Match[] = []

        for (const context of this.contexts) {
            for (const match of context.matchPattern(tokens)) {

                // was the matched node the end of a pattern?
                const isTerminalMatch: boolean = match.node.end

                // if the sub-context matched on a terminal node, update the matched node to be this node
                if (isTerminalMatch) match.node = this

                // complete match in sub-context. (tokens exhuasted)
                if (match.remainder.length === 0) {
                    // if the sub-context matched on a terminal node,
                    matches.push(match) // TODO deal with hopping up contextual levels if a leaf is detected.
                    continue
                }

                // a remiander exists.

                // if it was not a terminal match in the sub-context, a match is impossible
                if (!isTerminalMatch) continue

                // the match was on a pattern terminal in the sub-context and this lookup node is
                // itself a terminal. the remainder may be able to be matched at a the context above.
                if (this.end) matches.push(match)

                // attempt to resolve a little more of the remainder on this contextual level.
                // even if this node is a terminal, it could have a continued pattern that we
                // could potentially match with.
                matches.concat(this.matchWord(match.remainder))
            }
        }

        return matches
    }
}
