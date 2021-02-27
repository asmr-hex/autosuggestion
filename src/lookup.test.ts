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
        it('returns the lookup node as a match when a match has no remainder', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            expect(lookup.matchPattern(['big', 'bug'])).toEqual([{ node: lookup, remainder: [] }])
        })
        it('returns a match with a remainder, given tokens which match a sub-context but no other words in the current context', () => {
            const dictionary: Dictionary = new Dictionary()
            const trie: Trie = dictionary.define('A')

            dictionary.define('B', [['big', 'bug']])
            trie.add({ 'b': 'B' })
            const lookup = trie.next.lookup['b']

            // BREADCRUMB: looks like if we take out the 'here' in the argument, it will
            // identify 'lookup' as a matching node. seems like something to do with not
            // pushing a node to matches in the sub-context (i.e. in Node.matchPattern) if
            // a pattern is a substring of a provided input token pattern. I.e., when trying to
            // match all the tokens in a sub-context, we encounter a node that has end === true--
            // we might not be pushing that node to the matches result in this case....
            // TODO look into this.
            expect(lookup.matchPattern(['big', 'bug', 'here'])).toEqual([
                { node: lookup, remainder: ['here'] }
            ])
        })
    })
})
