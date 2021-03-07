import { Word, SuggestedPattern } from './types'

export class SuggestedWord {
    constructor() {

    }
}


export class Suggestion {
    public rank: number = 0
    private _simplified: Word[] = []

    constructor(public words: SuggestedPattern) {

    }

    get simplified(): Word[] {
        return this._simplified
    }
}
