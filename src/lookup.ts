import { Context } from './types'

import { Node } from './node'


export class LookupNode extends Node {
    constructor(alias: string, readonly contexts: Context[]) {
        super(alias)
    }
}
