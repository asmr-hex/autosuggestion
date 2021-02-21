import { Node } from './node'


export class LookupNode extends Node {
    constructor(label: string, readonly contexts: Context[]) {
        super(label)
    }
}
