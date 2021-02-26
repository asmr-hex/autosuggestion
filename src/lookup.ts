import { Word } from './types'
import { Node, Match } from './node'


export class LookupNode extends Node {
    constructor(alias: string, readonly contexts: Node[]) {
        super(alias)
    }

    public matchPattern(tokens: Word[]): Match[] {
        let matches: Match[] = []

        for (const context of this.contexts) {
            for (const match of context.matchPattern(tokens)) {
                // complete match in sub-context.
                if (match.remainder.length === 0) {
                    matches.push(match) // TODO deal with hopping up contextual levels if a leaf is detected.
                    continue
                }

                // ends a pattern, the remainder may be able to be matched at a higher contextual level.
                if (this.end) matches.push(match)

                // attempt to resolve a little more of the remainder on this contextual level.
                matches.concat(this.matchWord(match.remainder))
            }
        }

        return matches
    }
}
