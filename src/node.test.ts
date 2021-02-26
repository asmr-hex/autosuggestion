import { Node } from './node'
import { Trie } from './trie'
import { Dictionary } from './dictionary'


describe('Node', () => {
    describe('.matchPattern(...)', () => {
        it.todo('works')
    })
    describe('.matchWord(...)', () => {
        it('returns an empty array, given a single token whose first char does not match a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['wave']
            expect(trie.matchWord(tokens)).toEqual([])
        })
        it('returns an empty array, given a single token does not match a next word in a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sink']
            expect(trie.matchWord(tokens)).toEqual([])
        })
        it('returns an empty array, given two tokens, the first token not matching a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sink', 'wave']
            expect(trie.matchWord(tokens)).toEqual([])
        })
        it('returns an empty array, given two tokens, the second token not matching a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sine', 'wava']
            expect(trie.matchWord(tokens)).toEqual([])
        })
        it('returns a single Match with no remainder, given one token which matches a word in a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sine']
            const matches = [
                {
                    node: trie.next.word['s'].next.char['i'].next.char['n'].next.char['e'],
                    remainder: [],
                }
            ]
            expect(trie.matchWord(tokens)).toEqual(matches)
        })
        it('returns a single Match with no remainder, given two tokens which partially match a single pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sine', 'wav']
            const matches = [
                {
                    node: trie.next.word['s'].next.char['i'].next.char['n'].next.char['e'].next.word['w'].next.char['a'].next.char['v'],
                    remainder: [],
                }
            ]
            expect(trie.matchWord(tokens)).toEqual(matches)
        })
        it('returns a single Match with no remainder, given two tokens which completely match a single pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['sine', 'wave'])

            const tokens = ['sine', 'wave']
            const matches = [
                {
                    node: trie.next.word['s'].next.char['i'].next.char['n'].next.char['e'].next.word['w'].next.char['a'].next.char['v'].next.char['e'],
                    remainder: [],
                }
            ]
            expect(trie.matchWord(tokens)).toEqual(matches)
        })
        it.todo('returns multiple matches.... TODO test with lookups in patterns now')
    })
    describe('.matchChars(...)', () => {
        it('returns null given a null-valued node', () => {
            const node: Node = new Node(null)
            expect(node.matchChars('hello')).toBeNull()
        })
        it('returns null if the word does not match', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('wavelet')

            const word = 'waves'
            expect(trie.next.word['w'].matchChars(word)).toBeNull()
        })
        it('returns the last matching node given a word matching a portion of a pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('wavelet')

            const word = 'wave'
            const expectation = trie.next.word['w'].next.char['a'].next.char['v'].next.char['e']
            expect(trie.next.word['w'].matchChars(word)).toEqual(expectation)
        })
        it('returns the last matching node given a word matching a complete pattern', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('wave')

            const word = 'wave'
            const expectation = trie.next.word['w'].next.char['a'].next.char['v'].next.char['e']
            expect(trie.next.word['w'].matchChars(word)).toEqual(expectation)
        })
        it('returns null given a word which is longer than the pattern (pattern is a substr of the provided word)', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('wave')

            const word = 'wavelet'
            expect(trie.next.word['w'].matchChars(word)).toBeNull()
        })
    })
})
