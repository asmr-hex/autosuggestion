import { Word, SuggestedPattern } from './types'
import { isWord } from './typegaurds'


export class Suggestion {
    public rank: number = 0
    private _simplified: Word[] = []

    constructor(public words: SuggestedPattern) {
        this._simplified = words.map(w => {
            return isWord(w)
                ? w
                : `[${Object.keys(w)[0]}]` // TODO make delimeters configurable
        })
    }

    get simplified(): Word[] {
        return this._simplified
    }
}
