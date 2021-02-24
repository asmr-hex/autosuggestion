import { Pattern } from './types'

import { NormalizePattern } from './util'


describe('utility functions', () => {
    describe('NormalizePattern(...)', () => {
        it('returns a pattern given a single word', () => {
            expect(NormalizePattern('blobfish')).toEqual(['blobfish'])
        })
        it('returns a pattern given a single lookup', () => {
            const lookup = { 'animals': ['bison', 'waterbear'] }
            expect(NormalizePattern(lookup)).toEqual([lookup])
        })
        it('returns a pattern given a pattern with only words', () => {
            const pattern: Pattern = ['a11', 'c0pz', 'r', 'b4st4rds']
            expect(NormalizePattern(pattern)).toEqual(pattern)
        })
    })
})
