import { Word, Lookup, Pattern } from './types'

import { isWord, isLookup } from './typegaurds'


describe('typeguard functions', () => {
    describe('isWord(...)', () => {
        it('returns true given a word', () => {
            const word: Word = 'acab'
            expect(isWord(word)).toBeTruthy()
        })
        it('returns false given a lookup', () => {
            const lookup: Lookup = { a: ['c', 'a', 'b'] }
            expect(isWord(lookup)).toBeFalsy()
        })
        it('returns false given a lookup pattern', () => {
            const pattern: Pattern = [{ a: ['c'] }, { a: ['b'] }]
            expect(isWord(pattern)).toBeFalsy()
        })
        it('returns false given a word pattern', () => {
            const pattern: Pattern = ['a11', 'c0pz', 'r', 'b4st4rds']
            expect(isWord(pattern)).toBeFalsy()
        })
        it('returns false given a word and lookup pattern', () => {
            const pattern: Pattern = ['a', { c: ['a'] }, 'b']
            expect(isWord(pattern)).toBeFalsy()
        })
    })
    describe('isLookup(...)', () => {
        it('returns true given a lookup', () => {
            const lookup: Lookup = { a: ['c', 'a', 'b'] }
            expect(isLookup(lookup)).toBeTruthy()
        })
        it('returns false given a word', () => {
            const word: Word = 'acab'
            expect(isLookup(word)).toBeFalsy()
        })
        it('returns false given a lookup pattern', () => {
            const pattern: Pattern = [{ a: ['c'] }, { a: ['b'] }]
            expect(isLookup(pattern)).toBeFalsy()
        })
        it('returns false given a word pattern', () => {
            const pattern: Pattern = ['a11', 'c0pz', 'r', 'b4st4rds']
            expect(isLookup(pattern)).toBeFalsy()
        })
        it('returns false given a word and lookup pattern', () => {
            const pattern: Pattern = ['a', { c: ['a'] }, 'b']
            expect(isLookup(pattern)).toBeFalsy()
        })
    })

})
