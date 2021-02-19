import {
    isWord,
    isLookupObject,
} from './typegaurds'


export const NormalizePattern: (words: string | LookupObject | Lookup | Pattern | InputPattern) => Pattern = words => {
    if (isWord(words)) return [words]
    if (isLookupObject(words)) return [convertObjectToLookup(words)]
    return words
}

export function convertObjectToLookup(obj: LookupObject): Lookup {
    return new Map(Object.entries(obj))
}
