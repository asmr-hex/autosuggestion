import { Word, SuggestedPattern } from './types'
import { isWord } from './typegaurds'


export class Suggestion {
    public rank: number = 0
    private _simplified: Word[] = []

    constructor(public tokens: SuggestedPattern) {
        this._simplify()
    }

    get simplified(): Word[] {
        return this._simplified
    }

    get length(): number {
        return this.tokens.length
    }

    public concat(suggestion: Suggestion): Suggestion {
        this.tokens = this.tokens.concat(suggestion.tokens)
        this._simplify()

        return this
    }

    public splice(offset: number, tokens: Word[]): Suggestion {
        if (offset === -1) offset = this.tokens.length
        this.tokens = [...this.tokens.slice(0, offset), ...tokens, ...this.tokens.slice(offset)]
        this._simplify()

        return this
    }

    /**
     * Given a sequence of offset tokens and a range, `n`, to resolve, this method
     * will resolve the next `n` contiguous lookups which occur after the provided
     * offset tokens. If the last token in the offset tokens is a substring of the
     * token at that offset in this suggestion, then no further resolution will occur.
     * This is mean to only resolve sequences of contiguous lookups occuring directly
     * after the final offset token if the final offset token completes a word suggestion.
     */
    public resolveLookups(offsetTokens: Word[], n: number): Suggestion[] {
        const offset = offsetTokens.length

        if (n === 0) return [this]

        if (this.tokens.length < offset) return [this]

        // does the final offset token equal the word at that index in the suggestion?
        // if not, do not proceed.
        if (offsetTokens[offset - 1] !== this.tokens[offset - 1]) return [this]

        // if the next token is a word (and not a lookup), do not proceed.
        if (isWord(this.tokens[offset])) return [this]

        // okay, the next token is a lookup

        let suggestions: Suggestion[] = []

        // iterate over each context of a lookup token.
        for (const context of Object.values(this.tokens[offset])[0]) {
            for (const suggestion of context.completePattern([])) {
                // splice the new suggestion with the pre-existing suggestion
                // (effectively expanding the next lookup)
                suggestion
                    .splice(0, offsetTokens)
                    .splice(-1, this.tokens.slice(offset + 1))

                console.log(suggestion)
                // is the next token a word? if so, resolve
                if (isWord(suggestion.tokens[offset])) {
                    suggestions = suggestions.concat(suggestion.resolveLookups(suggestion.tokens.slice(0, offset + 1), n - 1))
                } else {
                    suggestions = suggestions.concat(suggestion.resolveLookups(offsetTokens, n))
                }
            }
        }

        return suggestions
    }

    private _simplify() {
        this._simplified = this.tokens.map(t => {
            return isWord(t)
                ? t
                : `[${Object.keys(t)[0]}]` // TODO make delimeters configurable
        })
    }
}
