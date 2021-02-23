import { Node } from './node'


type SimplifiedNode = Word | Lookup | null
type SimplifiedTrie = (SimplifiedTrie | SimplifiedNode)[]

export function simplify(node: Node, simplified: SimplifiedTrie = []): SimplifiedTrie {
    let paths: SimplifiedTrie = []

    for (const c of Object.values(node.next.char)) {
        paths.push(simplify(c, [c.value]))
    }
    for (const w of Object.values(node.next.word)) {
        paths.push(simplify(w, [' ', w.value as string]))
    }
    for (const r of Object.values(node.next.lookup)) {
        paths.push(simplify(r, [{ [r.value as string]: r.contexts }]))
    }

    if (paths.length === 0) return simplified
    if (paths.length === 1) return simplified.concat(paths[0])

    return [...simplified, paths]
}
