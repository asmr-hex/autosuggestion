
type Word = string
type Context = string
type Value = string | null

interface Lookup {
    [index: string]: Context | Context[]
}

interface CharMap {
    [index: string]: import('./node').Node
}

interface LookupMap {
    [index: string]: import('./lookup').LookupNode
}

interface NextNodes {
    char: CharMap
    word: CharMap
    lookup: LookupMap
}

type Pattern = (string | Lookup)[]

