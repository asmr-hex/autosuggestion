import { Node } from './node'
import { Suggestion } from './suggestion'
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
    describe('.completePattern(...)', () => {
        it.todo('returns a single suggestion, given a terminal leaf node')
        it('returns multiple suggestions, given a terminal leaf lookup node with one word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            const bTrie: Trie = dictionary.define('B', [['bub']])
            trie.add([{ 'familiars': 'B' }])
            trie.add([{ 'unfamiliars': 'B' }])

            const expectations = [
                new Suggestion([{ 'familiars': [bTrie] }]),
                new Suggestion([{ 'unfamiliars': [bTrie] }]),
            ]
            expect(trie.completePattern([])).toEqual(expectations)
        })
    })
    describe('.completeWord(...)', () => {
        it('returns a single suggestion, given a terminal leaf node', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('xi')

            const expectation = [new Suggestion(['xi'])]
            expect(trie.next.word['x'].next.char['i'].completeWord(['xi'])).toEqual(expectation)
        })
        it('returns a multiple suggestions, given a terminal node that is a substring of another suggestion', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('xi')
            trie.add('xiao')

            const expectation = [
                new Suggestion(['xi']),
                new Suggestion(['xiao'])
            ]
            expect(trie.next.word['x'].next.char['i'].completeWord(['xi'])).toEqual(expectation)
        })
        it('returns a multiple suggestions, given a node that branches into three suggestions', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add('xray')
            trie.add('xiao')
            trie.add('xylophone')

            const expectation = [
                new Suggestion(['xray']),
                new Suggestion(['xiao']),
                new Suggestion(['xylophone']),
            ]
            expect(trie.next.word['x'].completeWord(['x'])).toEqual(expectation)
        })
        it('returns a single suggestion consisting of a multi-word sequence', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['mischief', 'knight'])

            const expectation = [
                new Suggestion(['mischief', 'knight']),
            ]
            expect(trie.next.word['m'].completeWord(['m'])).toEqual(expectation)
        })
        it('returns multiple suggestions consisting of multi-word sequences', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['mischief', 'knight'])
            trie.add(['mischief', 'knife'])

            const expectation = [
                new Suggestion(['mischief', 'knight']),
                new Suggestion(['mischief', 'knife']),
            ]
            expect(trie.next.word['m'].completeWord(['m'])).toEqual(expectation)
        })
    })
})
