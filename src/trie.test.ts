import { Trie } from './trie'
import { Node } from './node'
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
})
