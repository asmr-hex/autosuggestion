import { Word } from './types'

export class SuggestedWord {
    constructor() {

    }
}


export class Suggestion {
    words: SuggestedWord[] = []
    rank: number = 0
    private _simplified: Word[] = []

    constructor() {

    }

    get simplified(): Word[] {
        return this._simplified
    }
}
