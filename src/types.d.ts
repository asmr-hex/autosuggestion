
type Word = string
type Context = string

type Value = string | null

type Lookup = Map<string, Context[]>

interface LookupObject {
    [index: string]: Context[]
}

enum TrieType {
    Lookup,
    Word,
}

interface NextNodes {
    char: Map<string, Node>
    word: Trie | null
    lookup: Lookup
}

type Pattern = (string | Lookup)[]

type InputPattern = (string | LookupObject)[]

