import { Trie } from './trie'
import { Node } from './node'
import { LookupNode } from './lookup'
import { simplify } from './test_util'


describe('Trie', () => {
    describe('.add(...)', () => {
        it.skip('normalizes the input and inserts the pattern', () => {
        })
    })
    describe('._add(...)', () => {
        it('adds a single pattern of a single word', () => {
            const trie: Trie = new Trie()
            const pattern: Pattern = ['acab']
            const expectations = ['a', 'c', 'a', 'b']

            trie._add(trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of multiple words', () => {
            const trie: Trie = new Trie()
            const pattern: Pattern = ['acab', 'or', 'acai']
            const expectations = ['a', 'c', 'a', 'b', ' ', 'o', 'r', ' ', 'a', 'c', 'a', 'i']

            trie._add(trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of a single lookup', () => {
            const trie: Trie = new Trie()
            const pattern: Pattern = [{ critters: ['frog', 'turtle'] }]
            const expectations = pattern

            trie._add(trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds a single pattern of multiple lookups', () => {
            const trie: Trie = new Trie()
            const pattern: Pattern = [{ critters: ['frog', 'turtle'] }, { stones: ['emerald', 'topaz'] }]
            const expectations = pattern

            trie._add(trie, pattern)
            expect(simplify(trie)).toEqual(expectations)
        })

        it('adds multiple patterns of a single word', () => {
            const trie: Trie = new Trie()
            const patterns: Pattern[] = [['acab'], ['acai']]
            const expectations = ['a', 'c', 'a', [['b'], ['i']]]

            trie._add(trie, patterns[0])
            trie._add(trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of multiple words', () => {
            const trie: Trie = new Trie()
            const patterns: Pattern[] = [['ab', 'cd'], ['about', 'u']]
            const expectations = ['a', 'b', [['o', 'u', 't', ' ', 'u'], [' ', 'c', 'd']]]

            trie._add(trie, patterns[0])
            trie._add(trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of a single lookup', () => {
            const trie: Trie = new Trie()
            const patterns: Pattern[] = [[{ food: ['pizza'] }], [{ slime: ['mold'] }]]
            const expectations = [patterns]

            trie._add(trie, patterns[0])
            trie._add(trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
        it('adds multiple patterns of multiple lookups', () => {
            const trie: Trie = new Trie()
            const patterns: Pattern[] = [[{ food: ['pizza'] }, { colors: ['blue'] }], [{ slime: ['mold'] }, { enjoyment: ['leisure'] }]]
            const expectations = [patterns]

            trie._add(trie, patterns[0])
            trie._add(trie, patterns[1])
            expect(simplify(trie)).toEqual(expectations)
        })
    })
    describe('_addFirstCharOfNextWord', () => {
        it('adds the first character of a word to node.next.word and returns the char node', () => {
            const trie: Trie = new Trie()
            const word: Pattern = ['bat']
            const expectation = { node: new Node('b'), pattern: ['at'] }

            const result = trie._addFirstCharOfNextWord(trie, word)
            expect(result).toEqual(expectation)
            expect(result.node.end).toBeFalsy()
        })
        it('adds the first character of a single char word to node.next.word and returns the char node', () => {
            const trie: Trie = new Trie()
            const word: Pattern = ['b']
            const expectation = { node: new Node('b'), pattern: [] }
            expectation.node.end = true

            const result = trie._addFirstCharOfNextWord(trie, word)
            expect(result).toEqual(expectation)
            expect(result.node.end).toBeTruthy()
        })
    })
    describe('_addChars(...)', () => {
        it('adds a word to the provided node', () => {
            const trie: Trie = new Trie()
            const word: Word = 'mold'
            const expectation = new Node('d')
            expectation.end = true
            expect(trie._addChars(trie, word)).toEqual(expectation)
            expect(simplify(trie)).toEqual(['m', 'o', 'l', 'd'])
        })
        it('adds multiple words, forming a diverging path', () => {
            const trie: Trie = new Trie()
            const words: Word[] = ['fungi', 'funguy']
            const expectation = ['f', 'u', 'n', 'g', [['i'], ['u', 'y']]]

            trie._addChars(trie, words[0])
            trie._addChars(trie, words[1])

            expect(simplify(trie)).toEqual(expectation)
            expect(trie.next.char['f'].next.char['u'].next.char['n'].next.char['g'].next.char['i'].end).toBeTruthy()
            expect(trie.next.char['f'].next.char['u'].next.char['n'].next.char['g'].next.char['u'].next.char['y'].end).toBeTruthy()
        })
        it('adds multiple words, where one word is a substr of the other', () => {
            const trie: Trie = new Trie()
            const words: Word[] = ['fun', 'fungi']
            const expectation = ['f', 'u', 'n', 'g', 'i']

            trie._addChars(trie, words[0])
            trie._addChars(trie, words[1])

            expect(simplify(trie)).toEqual(expectation)
            expect(trie.next.char['f'].next.char['u'].next.char['n'].end).toBeTruthy()
        })
    })
    describe('_addLookup(...)', () => {
        it('adds a single lookup with a single context to a node', () => {
            const trie: Trie = new Trie()
            const lookup: Lookup = { animals: 'mammals' }
            const expectation: LookupNode = new LookupNode('animals', ['mammals'])
            expectation.end = true

            expect(trie._addLookup(trie, lookup)).toEqual([expectation])
            expect(Object.keys(trie.next.lookup)).toEqual(['animals'])
            expect(Object.values(trie.next.lookup)).toEqual([expectation])
        })
        it('adds a single lookup with multiple contexts to a node', () => {
            const trie: Trie = new Trie()
            const lookup: Lookup = { animals: ['mammals', 'bugs'] }
            const expectation: LookupNode = new LookupNode('animals', ['mammals', 'bugs'])
            expectation.end = true

            expect(trie._addLookup(trie, lookup)).toEqual([expectation])
            expect(Object.keys(trie.next.lookup)).toEqual(['animals'])
            expect(Object.values(trie.next.lookup)).toEqual([expectation])
        })
    })
})
