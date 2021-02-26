import { Node } from './node'


describe('Node', () => {
    describe('.matchPattern(...)', () => {
        it.todo('works')
    })
    describe('.matchWord(...)', () => {
        it.todo('works')
    })
    describe('.matchChars(...)', () => {
        it('returns null given a null-valued node', () => {
            const node: Node = new Node(null)
            expect(node.matchChars('hello')).toBeNull()
        })
    })
})
