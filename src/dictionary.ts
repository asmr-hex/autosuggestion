import { Pattern, ScopeName, Word } from './types'

import { Scope } from './scope'
import { Suggestion } from './suggestion'


/**
 * <p align="center"> 
 *   <img src="https://web.archive.org/web/20000828135714/http://www.geocities.com:80/HotSprings/4530/turnbook.gif">
 *   <img src="https://web.archive.org/web/20000828135714/http://www.geocities.com:80/HotSprings/4530/turnbook.gif">
 *   <img src="https://web.archive.org/web/20000828135714/http://www.geocities.com:80/HotSprings/4530/turnbook.gif">
 * </p>
 *
 * A `Dictionary` is used to define, add/remove patterns to/from, and generate
 * suggestions from suggestion scopes. As someone using this library, the 
 * `Dictionary` class will likely be the primary interface between your code
 * and the functionality `autosuggestion` has to offer.
 *
 * Generally speaking, a `Dictionary` is a collection of named [[Trie|scopes]] containing [[Pattern|patterns]]
 * (words or phrases) which can be easily matched with partially completed input patterns 
 * <sup><a href="#fn-dictionary-1">1</a></sup>. For example,
 * if we want to generate suggestions based on a list of colors, we can
 * ```javascript
 * // create a new dictionary
 * const myDictionary = new Dictionary()
 *
 * // define a named context with some colors
 * myDictionary.define('myColors', ['red', 'rose', 'pink'])
 * ```
 * now, we can generate suggestions given input,
 * ```javascript
 * const inputText = 'r'
 *
 * // match input text with potential completions in the 'myColors' context
 * const colorSuggestions = myDictionary.suggest(inputText, 'myColors')
 * // outputs: red, rose
 * ```
 *
 * <p align="center"> 
 *   <img height="50px" src=" https://web.archive.org/web/20091020080355/http://hk.geocities.com/fatkeehk1/mov-book.gif">
 *   <img height="50px" src=" https://web.archive.org/web/20091020080355/http://hk.geocities.com/fatkeehk1/mov-book.gif">
 *   <img height="50px" src=" https://web.archive.org/web/20091020080355/http://hk.geocities.com/fatkeehk1/mov-book.gif">
 * </p>
 *
 * If we don't know all the patterns for a scope upfront, we can dynamically add,
 * ```javascript
 * myDictionary.add('myColors', ['salmon', 'violet', 'avocado'])
 * ```
 * or remove,
 * ```javascript
 * myDictionary.remove('myColors', ['red', 'salmon'])
 * ```
 * ---
 *
 * <div style="font-style:italic;font-size:small">
 *  <p id="fn-dictionary-1">
 *    [1] Each named scope is a special type of <a href="https://en.wikipedia.org/wiki/Trie">trie</a>
 *        indexed by a string-valued name. What makes this type of trie special is that each node not
 *        only points to the set of next character candidates, but also points to the set of next 
 *        word candidates. This makes it, essentially, a trie of tries allowing us to perform phrase-based
 *        matches in addition to word-based matches.
 *  </p>
 * </div>
 */
export class Dictionary {
    /**
     * A map of scope names to corresponding scopes.
     */
    public scopes: Map<ScopeName, Scope> = new Map()

    /**
     * Configures how many consecutive [[Lookup|lookups]] to resolve given a 
     * suggestion with a lookup [[Term|term]] which immediately follows the input pattern.
     *
     * For example, if there exists the following pattern
     * ```javascript
     * // assume the scopes for the 'color', 'size', & 'shape' scope groups have been defined.
     * one two <color> <size> <shape>
     * ```
     * then, given an input of `['one', 'two']` & `lookahead=2`, the resulting suggestions would be,
     * ```javascript
     * one two green big <shape>
     * one two red big <shape>
     * one two green small <shape>
     * ...
     * ```
     */
    public lookahead: number = 0

    /**
     * Constructs a `Dictionary`.
     * @param lookahead sets [[Dictionary.lookahead|lookahead]] parameter.
     */
    constructor(lookahead: number = 0) {
        this.lookahead = lookahead
    }

    /**
     * Defines a new named scope and populates it with optionally provided patterns.
     * @param scopeName the new scope name.
     * @param patterns optional initial scope patterns.
     */
    define(scopeName: ScopeName, patterns: Pattern[] = []): Scope {
        const scope: Scope = new Scope(this, patterns)
        this.scopes.set(scopeName, scope)
        return scope
    }

    /**
     * Adds patterns to an existing scope.
     * @param scopeName an existing scope name.
     * @param patterns array of patterns to add.
     */
    add(scopeName: ScopeName, patterns: Pattern[]) {
        // TODO make it optional to pass in a Word | Lookup | Pattern | Pattern []
        const scope = this.scopes.get(scopeName)
        if (!scope) return
        for (const pattern of patterns) {
            scope.add(pattern)
        }
    }

    /**
     * Removes patterns from an existing scope.
     * @param scopeName an existing scope name.
     * @param patterns array of patterns to remove.
     */
    remove(scopeName: ScopeName, patterns: Pattern[]) {
        // TODO make it optional to pass in a Word | Lookup | Pattern | Pattern []
        const scope = this.scopes.get(scopeName)
        if (!scope) return
        for (const pattern of patterns) {
            scope.remove(pattern)
        }
    }

    /**
     * Generates suggestions from specified scopes given an array of input tokens.
     *
     * This method expects that the input tokens have already been tokenized by the
     * calling code. In particular, multi-word inputs, which are expected to be matched
     * against phrase-based patterns which have been added to a scope, must be broken up
     * into a array of words (rather than just an raw string with words separated by spaces).
     *
     * @param tokens a single input word token or array of input word tokens.
     * @param scopes the scopes to search. Given none, all scopes are searched.
     */
    suggest(tokens: Word | Word[], scopeNames: ScopeName[] = []): Suggestion[] {
        let suggestions: Suggestion[] = []

        // if no scope names have been provided, search all scopes.
        if (scopeNames.length === 0) scopeNames = Array.from(this.scopes.keys())

        for (const scopeName of scopeNames) {
            const scope = this.scopes.get(scopeName)
            if (!scope) continue
            suggestions = suggestions.concat(scope.suggest(tokens, this.lookahead))
        }

        return suggestions
    }
}
