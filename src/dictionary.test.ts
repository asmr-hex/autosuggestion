import { Suggestion } from './suggestion'
import { Dictionary } from './dictionary'


describe('Dictionary', () => {
    describe('describe(...)', () => { })
    describe('add(...)', () => { })
    describe('remove(...)', () => { })
    describe('suggest(...)', () => {
        it('returns one suggestion given a single match', () => {
            const dictionary = new Dictionary()
            dictionary.define('noun', [['apple'], ['orange']])

            const expectation: Suggestion[] = [
                new Suggestion(['apple'])
            ]
            expect(dictionary.suggest('a')).toEqual(expectation)
        })
    })
})
