import { Word, Lookup, Pattern } from './types'

import { Dictionary } from './dictionary'
import { Scope } from './scope'
import { Node } from './node'
import { Suggestion } from './suggestion'
import { LookupNode } from './lookup'
import { simplify } from './test_util'


describe('Trie', () => {
    describe('.add(...)', () => {
        it.skip('normalizes the input and inserts the pattern', () => { })
        it('adds two single-word patterns, where the first is a substring of the second', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const expectations = [' ', 'a', 'r', 't', 'f', 'u', 'l']

            trie.add(['art'])
            trie.add(['artful'])
            expect(simplify(trie)).toEqual(expectations)
            expect(trie.next.word['a'].next.char['r'].next.char['t'].end).toBeTruthy()
            expect(trie.next.word['a'].next.char['r'].next.char['t'].next.char['f'].next.char['u'].next.char['l'].end).toBeTruthy()
        })
        it('adds two single-word patterns, where the second is a substring of the first', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const expectations = [' ', 'a', 'r', 't', 'f', 'u', 'l']

            trie.add(['artful'])
            trie.add(['art'])
            expect(simplify(trie)).toEqual(expectations)
            expect(trie.next.word['a'].next.char['r'].next.char['t'].end).toBeTruthy()
            expect(trie.next.word['a'].next.char['r'].next.char['t'].next.char['f'].next.char['u'].next.char['l'].end).toBeTruthy()
        })
        it('adds multiple patterns which overlap on the first word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('A')

            trie.add(['big', 'bug'])
            trie.add(['bib'])
            const expectations = [' ', 'b', 'i', [['g', ' ', 'b', 'u', 'g'], ['b']]]

            expect(simplify(trie)).toEqual(expectations)
        })
    })
    describe('._add(...)', () => {
        it('adds a single pattern of a single word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const pattern: Pattern = ['acab']
            const expectations = ['a', 'c', 'a', 'b']

            trie['_add'](trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of multiple words', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const pattern: Pattern = ['acab', 'or', 'acai']
            const expectations = ['a', 'c', 'a', 'b', ' ', 'o', 'r', ' ', 'a', 'c', 'a', 'i']

            trie['_add'](trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of a single lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')

            const frog: Scope = dictionary.define('frog')
            const turtle: Scope = dictionary.define('turtle')

            const pattern: Pattern = [{ critters: ['frog', 'turtle'] }]
            const expectations = [{ critters: [frog, turtle] }]

            trie['_add'](trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of multiple lookups', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')

            const frog: Scope = dictionary.define('frog')
            const turtle: Scope = dictionary.define('turtle')
            const emerald: Scope = dictionary.define('emerald')
            const topaz: Scope = dictionary.define('topaz')

            const pattern: Pattern = [{ critters: ['frog', 'turtle'] }, { stones: ['emerald', 'topaz'] }]
            const expectations = [{ critters: [frog, turtle] }, { stones: [emerald, topaz] }]

            trie['_add'](trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })

        it('adds multiple patterns of a single word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const patterns: Pattern[] = [['acab'], ['acai']]
            const expectations = ['a', 'c', 'a', [['b'], ['i']]]

            trie['_add'](trie, patterns[0])
            trie['_add'](trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of multiple words', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const patterns: Pattern[] = [['ab', 'cd'], ['about', 'u']]
            const expectations = ['a', 'b', [['o', 'u', 't', ' ', 'u'], [' ', 'c', 'd']]]

            trie['_add'](trie, patterns[0])
            trie['_add'](trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of a single lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')

            const pizza: Scope = dictionary.define('pizza')
            const mold: Scope = dictionary.define('mold')

            const patterns: Pattern[] = [[{ food: ['pizza'] }], [{ slime: ['mold'] }]]
            const expectations = [[[{ food: [pizza] }], [{ slime: [mold] }]]]

            trie['_add'](trie, patterns[0])
            trie['_add'](trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of multiple lookups', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')

            const pizza = dictionary.define('pizza')
            const blue = dictionary.define('blue')
            const mold = dictionary.define('mold')
            const leisure = dictionary.define('leisure')

            const patterns: Pattern[] = [[{ food: ['pizza'] }, { colors: ['blue'] }], [{ slime: ['mold'] }, { enjoyment: ['leisure'] }]]
            const expectations = [[[{ food: [pizza] }, { colors: [blue] }], [{ slime: [mold] }, { enjoyment: [leisure] }]]]

            trie['_add'](trie, patterns[0])
            trie['_add'](trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
    })
    describe('_addFirstCharOfNextWord', () => {
        it('adds the first character of a word to node.next.word and returns the char node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const word: Pattern = ['bat']
            const expectation = { node: new Node('b'), pattern: ['at'] }

            const result = trie['_addFirstCharOfNextWord'](trie, word)
            expect(result).toEqual(expectation)
            expect(result.node.end).toBeFalsy()
        })
        it('adds the first character of a single char word to node.next.word and returns the char node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const word: Pattern = ['b']
            const expectation = { node: new Node('b'), pattern: [] }
            expectation.node.end = true

            const result = trie['_addFirstCharOfNextWord'](trie, word)
            expect(result).toEqual(expectation)
            expect(result.node.end).toBeTruthy()
        })
        it('returns the char node if the first character of a word already exists in node.next.word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const { node: exists, pattern } = trie['_addFirstCharOfNextWord'](trie, ['bop'])
            trie['_addChars'](exists, pattern[0] as Word) // just use this as a shortcut.

            const word: Pattern = ['bat']
            const expectation = { node: exists, pattern: ['at'] }

            const result = trie['_addFirstCharOfNextWord'](trie, word)
            expect(result).toEqual(expectation)
            expect(result.node.end).toBeFalsy()
            expect(simplify(trie)).toEqual([' ', 'b', 'o', 'p'])
        })
    })
    describe('_addChars(...)', () => {
        it('adds a word to the provided node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const word: Word = 'mold'
            const expectation = new Node('d')
            expectation.end = true
            expect(trie['_addChars'](trie, word)).toEqual(expectation)
            expect(simplify(trie)).toEqual(['m', 'o', 'l', 'd'])
        })
        it('adds multiple words, forming a diverging path', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const words: Word[] = ['fungi', 'funguy']
            const expectation = ['f', 'u', 'n', 'g', [['i'], ['u', 'y']]]

            trie['_addChars'](trie, words[0])
            trie['_addChars'](trie, words[1])

            expect(simplify(trie)).toEqual(expectation)
            expect(trie.next.char['f'].next.char['u'].next.char['n'].next.char['g'].next.char['i'].end).toBeTruthy()
            expect(trie.next.char['f'].next.char['u'].next.char['n'].next.char['g'].next.char['u'].next.char['y'].end).toBeTruthy()
        })
        it('adds multiple words, where one word is a substr of the other', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const words: Word[] = ['fun', 'fungi']
            const expectation = ['f', 'u', 'n', 'g', 'i']

            trie['_addChars'](trie, words[0])
            trie['_addChars'](trie, words[1])

            expect(simplify(trie)).toEqual(expectation)
            expect(trie.next.char['f'].next.char['u'].next.char['n'].end).toBeTruthy()
        })
    })
    describe('_addLookup(...)', () => {
        it('adds a single lookup with a single context to a node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const mammalScope: Scope = dictionary.define('mammals')
            const lookup: Lookup = { animals: 'mammals' }
            const expectation: LookupNode = new LookupNode('animals', [mammalScope])
            expectation.end = true

            expect(trie['_addLookup'](trie, lookup)).toEqual([expectation])
            expect(Object.keys(trie.next.lookup)).toEqual(['animals'])
            expect(Object.values(trie.next.lookup)).toEqual([expectation])
        })
        it('adds a single lookup with multiple contexts to a node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test')
            const mammalsScope: Scope = dictionary.define('mammals')
            const bugsScope: Scope = dictionary.define('bugs')
            const lookup: Lookup = { animals: ['mammals', 'bugs'] }
            const expectation: LookupNode = new LookupNode('animals', [mammalsScope, bugsScope])
            expectation.end = true

            expect(trie['_addLookup'](trie, lookup)).toEqual([expectation])
            expect(Object.keys(trie.next.lookup)).toEqual(['animals'])
            expect(Object.values(trie.next.lookup)).toEqual([expectation])
        })
    })

    describe('suggest(...)', () => {
        it.todo('works.')
        it('adds two single-word patterns, where one is a substring of the other', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Scope = dictionary.define('test', [['artful'], ['art']])

            const expectations = [
                new Suggestion(['art']),
                new Suggestion(['artful']),
            ]

            expect(trie.suggest('a')).toEqual(expectations)
        })
        it('returns multiple suggestions, given a full word match that is a subset of another match in a sub-context', () => {
            const dictionary = new Dictionary()
            const a = dictionary.define('A', [['a'], ['an']])
            const b = dictionary.define('B', [['b'], ['bb']])
            const c = dictionary.define('C', [[{ A: 'A' }, { B: 'B' }]])

            const expectation: Suggestion[] = [
                new Suggestion(['a', { B: [b] }]),
                new Suggestion(['an', { B: [b] }]),
            ]
            expect(c.suggest('a')).toEqual(expectation)
        })
    })

})
