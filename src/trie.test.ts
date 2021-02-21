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
        it.skip('...', () => { })
    })
    describe('_addChars(...)', () => {
        it('adds a word to the provided node', () => {
            const trie: Trie = new Trie()
            const word: Word = 'mold'
            const expectation = new Node('d')
            expectation.end = true
            expect(trie._addChars(trie, word)).toEqual(expectation)
            expect(simplify(trie))
        })
        it.skip('adds multiple words, forming a diverging path', () => {
            const trie: Trie = new Trie()
            const words: Word[] = ['fungi', 'funguy']
            const expectation = ['f', 'u', 'n', 'g', [['i'], ['u', 'y']]]
        })
    })
    describe('_addLookup(...)', () => {
        it('adds a single lookup to a node', () => {
            const trie: Trie = new Trie()
            const lookup: Lookup = { animals: 'mammals' }
            const expectation: LookupNode = new LookupNode('animals', ['mammals'])
            expectation.end = true

            expect(trie._addLookup(trie, lookup)).toEqual([expectation])
            expect(Object.keys(trie.next.lookup)).toEqual(['animals'])
            expect(Object.values(trie.next.lookup)).toEqual([expectation])
        })
    })
})
