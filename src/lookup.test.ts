import { Dictionary } from './dictionary'
import { Trie } from './trie'
import { LookupNode } from './lookup'


describe('LookupNode', () => {
    describe('.matchPattern(...)', () => {
        it('returns no matches, given tokens which do not match in any context', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['small', 'slug'])).toEqual([])
        })
        it('returns no matches, given tokens which only partially match a complete word in a context (input is substring of context word)', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['bi', 'slug'])).toEqual([])
        })
        it('returns no matches, given tokens which match words within a pattern but not the entire pattern of a sub-context', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'slug'])).toEqual([])
        })
        it('returns no matches, given tokens which complete word in a context partially matches an input word (input is superstring of context word)', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['bigger', 'slug'])).toEqual([])
        })
        it('returns a match with no remainder, given exactly matching input tokens', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            const matches = lookup.matchPattern(['big', 'bug'])
            expect(matches.length).toEqual(1)
            expect(matches[0].remainder.length).toEqual(0)
        })
        it('returns a match with no remainder, given tokens which partially match a sub-context (the matched node is within the sub-context)', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            const bTrie: Trie = dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big'])).toEqual([
                { node: bTrie.next.word['b'].next.char['i'].next.char['g'], remainder: [] }
            ])
        })
        it('returns the lookup node as a match when a match has no remainder and is a complete match in the sub-context', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'bug'])).toEqual([{ node: lookup, remainder: [] }])
        })
        it('returns a match with a remainder, given tokens which match a sub-context but no other words in the current context (the match node is the lookup)', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'bug', 'here'])).toEqual([
                { node: lookup, remainder: ['here'] }
            ])
        })
        it('returns a match on the current lookup node with no remainder, given a pattern which matches the first sub-contextual lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug'], ['bib']])
            trie.add([{ 'b': 'B' }, { 'b': 'B' }])
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'bug'])).toEqual([
                { node: lookup, remainder: [] }
            ])
        })
        it('returns a match (a node from a nested context) with no remainder, given a pattern which matches a second sequential sub-contextual lookup', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            const bTrie = dictionary.define('B', [['big', 'bug'], ['bib']])
            trie.add([{ 'b': 'B' }, { 'bb': 'B' }])
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'bug', 'b'])).toEqual([
                { node: bTrie.next.word['b'], remainder: [] }
            ])
        })
        it('returns a match on the current lookup node with no remainder, given a pattern which matches multiple consecutive sub-contextual lookups', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug'], ['bib']])
            trie.add([{ 'b': 'B' }, { 'bb': 'B' }])
            const firstLookup = trie.next.lookup['b']
            const lastLookup = trie.next.lookup['b'].next.lookup['bb']

            expect(firstLookup.matchPattern(['big', 'bug', 'big', 'bug'])).toEqual([
                { node: lastLookup, remainder: [] }
            ])
        })
    })
})
