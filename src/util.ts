import { Word, Lookup, Pattern } from './types'

import {
    isWord,
    isLookup,
} from './typegaurds'


export function NormalizePattern(words: Word | Lookup | Pattern): Pattern {
    if (isWord(words)) return [words]
    if (isLookup(words)) return [words]
    return words
}
