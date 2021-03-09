import { Node, Match } from './node'
import { Suggestion } from './suggestion'
import { Trie } from './trie'
import { Dictionary } from './dictionary'


describe('Node', () => {
    describe('.isLeaf()', () => {
        it('returns false when there is one more char', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['ab'])

            expect(trie.next.word['a'].isLeaf()).toBeFalsy()
        })
        it('returns false when there is one more word', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('test')
            trie.add(['a'])
            trie.add(['a', 'thing'])

            expect(trie.next.word['a'].isLeaf()).toBeFalsy()
        })
        it('returns false when there is one more lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            dictionary.define('B', [['albatross']])
            const trie: Trie = dictionary.define('test')
            trie.add(['a'])
            trie.add(['a', { B: 'B' }])

            expect(trie.next.word['a'].isLeaf()).toBeFalsy()
        })
        it('returns false when there is no following char, word, or lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            dictionary.define('B', [['albatross']])
            const trie: Trie = dictionary.define('test')
            trie.add(['a'])

            expect(trie.next.word['a'].isLeaf()).toBeTruthy()
        })
    })
    describe('.matchPattern(...)', () => {
        it('returns one match with a two level call-stack of nodes, given a full word match that is a subset of another match in a sub-context', () => {
            const dictionary = new Dictionary()
            const a = dictionary.define('A', [['a'], ['an']])
            const b = dictionary.define('B', [['b'], ['bb']])
            const c = dictionary.define('C', [[{ A: 'A' }, { B: 'B' }]])

            const expectation: Match[] = [{
                nodes: [
                    a.next.word['a'],
                    c.next.lookup['A'],
                ],
                remainder: []
            }]
            expect(c.next.lookup['A'].matchPattern(['a'])).toEqual(expectation)
        })
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
                    nodes: [trie.next.word['s'].next.char['i'].next.char['n'].next.char['e']],
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
                    nodes: [trie.next.word['s'].next.char['i'].next.char['n'].next.char['e'].next.word['w'].next.char['a'].next.char['v']],
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
                    nodes: [trie.next.word['s'].next.char['i'].next.char['n'].next.char['e'].next.word['w'].next.char['a'].next.char['v'].next.char['e']],
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
        it('returns multiple suggestions, given a full-word match that is a substring of another match in a sub-context', () => {
            const dictionary = new Dictionary()
            const a = dictionary.define('A', [['a'], ['an']])
            const b = dictionary.define('B', [['b'], ['bb']])
            const c = dictionary.define('C', [[{ A: 'A' }, { B: 'B' }]])

            const expectedSuggestion1: Suggestion[] = [
                new Suggestion(['a']),
                new Suggestion(['an']),
            ]
            const expectedSuggestion2: Suggestion[] = [
                new Suggestion([{ B: [b] }]),
            ]

            const expectedMatch: Match[] = [{
                nodes: [
                    a.next.word['a'],
                    c.next.lookup['A'],
                ],
                remainder: []
            }]
            const matches = c.next.lookup['A'].matchPattern(['a'])

            expect(matches).toEqual(expectedMatch)
            expect(matches[0].nodes[0].completePattern(['a'])).toEqual(expectedSuggestion1)
            expect(matches[0].nodes[1].completePattern([])).toEqual(expectedSuggestion2)
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
