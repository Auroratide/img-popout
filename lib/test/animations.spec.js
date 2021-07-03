import { reverseOf, runAnimation } from '../src/animations.js'
import { expect } from 'chai'

describe('animations', () => {
    let window

    beforeEach(() => {
        window = new TestWindow()
    })

    describe('runAnimation', () => {
        it('transitioning a value for the duration', () => {
            let value = 0
        
            runAnimation({
                duration: 2,
                tick: (t) => value = t,
            }, window)
    
            window.frames.next()
            expect(value).to.equal(0)
    
            window.frames.next()
            expect(value).to.be.closeTo(0.5, 0.001)
    
            window.frames.next()
            expect(value).to.be.closeTo(1, 0.001)
        })
    
        it('animation lasts only for the duration', () => {
            let counter = 0
        
            runAnimation({
                duration: 3,
                tick: (t) => counter += 1,
            }, window)
    
            window.frames.next()
            window.frames.next()
            window.frames.next()
            window.frames.next()
            window.frames.next()
            window.frames.next()
    
            expect(counter).to.equal(4) // 0, 1, 2, 3
        })
    
        it('initialization', () => {
            let called = false
    
            runAnimation({
                initialize: () => called = true,
                duration: 3,
                tick: (t) => {},
            }, window)
    
            window.frames.next()
            expect(called).to.be.true
    
            called = false
            window.frames.next()
            expect(called).to.be.false // called only once
        })
    
        it('finalization', () => {
            let called = false
    
            runAnimation({
                finalize: () => called = true,
                duration: 2,
                tick: (t) => {},
            }, window)
    
            window.frames.next()
            expect(called).to.be.false // called only at end
    
            window.frames.next()
            expect(called).to.be.false
    
            window.frames.next()
            expect(called).to.be.true
        })

        it('using context', () => {
            let value = 1
        
            runAnimation({
                // using primes so value is always uniquely determined by
                // the identity and number of function calls
                context: () => ({ i: 2, t: 3, f: 5 }),
                initialize: (ctx) => value *= ctx.i,
                tick: (t, ctx) => value *= ctx.t,
                finalize: (ctx) => value *= ctx.f,
                duration: 2,
            }, window)

            window.frames.next()
            expect(value).to.equal(2 * 3)
    
            window.frames.next()
            expect(value).to.equal(2 * 3 * 3)
    
            window.frames.next()
            expect(value).to.equal(2 * 3 * 3 * 3 * 5)
        })

        it('different easing scale', () => {
            let value = 0

            runAnimation({
                easing: (t) => t * 100,
                duration: 2,
                tick: (t) => value += t,
            }, window)

            window.frames.next()
            window.frames.next()
            window.frames.next()
            expect(value).to.be.closeTo(50 + 100, 0.001)
        })
    })

    describe('reverseOf', () => {
        it('duration and tick', () => {
            const original = {
                duration: 4,
                tick: () => {},
            }

            expect(reverseOf(original)).to.include({
                duration: original.duration,
                tick: original.tick,
            })
        })

        it('initialize and finalize', () => {
            const original = {
                initialize: () => {},
                finalize: () => {},
            }

            expect(reverseOf(original)).to.include({
                initialize: original.finalize,
                finalize: original.initialize,
            })
        })

        it('context', () => {
            const original = {
                context: () => ({}),
            }

            expect(reverseOf(original)).to.include({
                context: original.context,
            })
        })

        it('easing', () => {
            const original = {
                easing: (t) => t,
            }

            const reverse = reverseOf(original)

            // time moves backward
            expect(reverse.easing(0)).to.equal(1)
            expect(reverse.easing(0.25)).to.equal(0.75)
            expect(reverse.easing(0.5)).to.equal(0.5)
            expect(reverse.easing(0.75)).to.equal(0.25)
            expect(reverse.easing(1)).to.equal(0)
        })

        it('easing missing', () => {
            const original = {}

            const reverse = reverseOf(original)

            // assume linearly backward
            expect(reverse.easing(0)).to.equal(1)
            expect(reverse.easing(0.25)).to.equal(0.75)
            expect(reverse.easing(0.5)).to.equal(0.5)
            expect(reverse.easing(0.75)).to.equal(0.25)
            expect(reverse.easing(1)).to.equal(0)
        })
    })
})

class TestWindow {
    time = 0
    functions = []
    frames = function*() {
        while(true) {
            const fns = [...this.functions]
            this.functions = []

            while (fns.length > 0)
                fns.shift()(this.time)
            this.time += 1
            yield null
        }
    }.bind(this)()

    performance = {
        now: () => this.time
    }

    requestAnimationFrame = (fn) => {
        this.functions.push(fn)
        return 0
    }
}
