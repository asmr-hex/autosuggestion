
type Word = string
type Context = string
type Value = string | null

interface Lookup {
    [index: string]: Context | Context[]
}

interface CharMap {
    [index: string]: Node
}

interface NextNodes {
    char: CharMap
    word: Trie | null
    lookup: LookupNode
}

type Pattern = (string | Lookup)[]

