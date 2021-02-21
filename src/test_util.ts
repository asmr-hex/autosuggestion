import { Node } from './node'


type SimplifiedNode = Word | Lookup
type SimplifiedTrie = (SimplifiedTrie | SimplifiedNode)[]

export function simplify(node: Node, simplified: SimplifiedTrie = []): SimplifiedTrie {
    const nextChars = Object.values(node.next.char)
    if (nextChars.length === 1) return simplify(nextChars[0], [...simplified, nextChars[0].value])

    return []
}
