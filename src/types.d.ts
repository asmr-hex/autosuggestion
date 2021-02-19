

type Context = string

type Value = string | null

type Lookup = Map<string, Context[]>

interface NextNodes {
    char: Map<string, Node>
    word: Map<string, Trie>
}


