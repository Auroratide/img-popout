import { popout } from '../../src/ImgPopoutElement/animations.js'
import { TestWindow } from '../browser/TestWindow.js'
import { TestElement } from '../browser/TestElement.js'
import { TestDocument } from '../browser/TestDocument.js'
import { runAnimation } from '../../src/animations.js'
import { expect } from 'chai'

describe('img-popout animations', () => {
    describe('popout', () => {
        const duration = popout(null, null, null, null, null).duration

        let document
        let window
        let cover
        let img
        let main

        const finish = () => {
            while(window.time <= duration) window.frames.next()
        }

        beforeEach(() => {
            document = new TestDocument()
            window = new TestWindow()
            cover = new TestElement()
            img = new TestElement()
            main = new TestElement()

            window.timeIncrement = 100
        })

        it('fades over time', () => {
            runAnimation(popout(cover, img, main, document, window), window)

            window.frames.next()
            expect(parseFloat(cover.style.opacity)).to.equal(0)

            window.frames.next()
            expect(parseFloat(cover.style.opacity)).to.be.greaterThan(0)
            expect(parseFloat(cover.style.opacity)).to.be.lessThan(1)

            finish()

            expect(parseFloat(cover.style.opacity)).to.equal(1)
        })
    })
})
