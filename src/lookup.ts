import { Word } from './types'
import { Node, Match } from './node'


export class LookupNode extends Node {
    constructor(alias: string, readonly contexts: Node[]) {
        super(alias)
    }

    public findMatching(tokens: Word[]): Match[] {
        let matches: Match[] = []

        for (const context of this.contexts) {
            matches = matches.concat(context.findMatching(tokens))
        }

        return matches
    }
}
