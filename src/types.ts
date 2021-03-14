
/**
 * A `Word` is a string.
 */
export type Word = string

/** The name of a [[Scope|scope]]. */
export type ScopeName = string

/** The name of a scope group defined by a [[Lookup|lookup]]. */
export type ScopeGroupName = string

/** The value of a [[Node|node]]. */
export type Value = string | null

/**
 * A `Term` is the basic building block of a suggestion pattern. A `Term`
 * can either be a [[Word|word]] or a [[Lookup|lookup]].
 */
export type Term = Word | Lookup

/**
 * Defines a LIFO queue representing the call stack for nodes nested within
 * lookup scopes. This is important for matching input to trie nodes and
 * then deriving all possible completions at each level of the call stack.
 */
export type NodeStack = import('./node').Node[]

/** A sequence of terms which define a suggesion pattern. */
export type Pattern = Term[]

/** A suggested pattern. */
export type SuggestedPattern = (Word | { [alias: string]: import('./node').Node[] })[]

/**
 * A `Lookup` is a [[Term|term]] within a [[Pattern| suggestion pattern]] which
 * is an unresolved placeholder.
 */
export interface Lookup {
    /**
     * A Lookup consists of a [[ScopeGroupName| scope group name]]
     * which indexes into an array of [[ScopeName|scope names]] or a single [[ScopeName|scope name]].
     * When a lookup is resolved/expanded, all the indexed scopes are searched.
     * For example, given the following `Lookup` definition,
     * ```javascript
     * { food: ['vegetables', 'fruits'] }  // assumed the 'vegetable' and 'fruits' scopes exist.
     * ```
     * when this term is resolved/expanded, it will search over the `'vegetables'` and
     * `'fruits'` [[Scope|scopes]].
     */
    [ScopeGroup: string]: ScopeName | ScopeName[]
}

/** maps a character to a [[Node|node]]. */
export interface CharMap {
    /** map by node value */
    [char: string]: import('./node').Node
}

/** maps a [[ScopeGroupName|scope group name]] to a [[LookupNode|lookup node]].*/
export interface LookupMap {
    /** map by scope group name*/
    [ScopeGroup: string]: import('./lookup').LookupNode
}

/** The next [[Nodes|nodes]] of a [[Node|node]]. */
export interface NextNodes {
    /** next character node */
    char: CharMap
    /** next word node */
    word: CharMap
    /** next lookup node */
    lookup: LookupMap
}
