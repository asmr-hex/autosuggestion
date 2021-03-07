
export type Word = string
export type Context = string
export type Value = string | null

export interface Lookup {
    [index: string]: Context | Context[]
}

export interface CharMap {
    [index: string]: import('./node').Node
}

export interface LookupMap {
    [index: string]: import('./lookup').LookupNode
}

/**
 * maybe _this_ should go in the `node.ts` file.
 *
 * collection of next nodes by *type*.
 *
 * ```typescript
 * const a = {
 *   char: {},
 *   word: {},
 *   lookup: {},
 * }
 *
 * interface Foo {
 *   member: boolean
 * }
 * ```
 */
export interface NextNodes {
    char: CharMap
    word: CharMap
    lookup: LookupMap
}

export type Pattern = (Word | Lookup)[]
export type SuggestedPattern = (Word | { [alias: string]: import('./node').Node[] })[]
