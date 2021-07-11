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
            // 100x100 allows px, vw/h, and % to have the same unit value
            document = new TestDocument({ width: 100, height: 100 })
            window = new TestWindow()
            cover = new TestElement()
            img = new TestElement({ width: 100, height: 100 })
            main = new TestElement({ width: 10, height: 10 })

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

        it('grows over time', () => {
            runAnimation(popout(cover, img, main, document, window), window)

            window.frames.next()
            expect(img.clientWidth).to.equal(main.clientWidth)
            expect(img.clientHeight).to.equal(main.clientHeight)

            window.frames.next()
            expect(img.clientWidth).to.be.greaterThan(main.clientWidth)
            expect(img.clientWidth).to.be.lessThan(document.documentElement.clientWidth)
            expect(img.clientHeight).to.be.greaterThan(main.clientHeight)
            expect(img.clientHeight).to.be.lessThan(document.documentElement.clientHeight)

            finish()
            expect(img.style.maxWidth).to.equal('90vw')
            expect(img.style.maxHeight).to.equal('90vh')
        })

        it('centers over time', () => {
            runAnimation(popout(cover, img, main, document, window), window)

            window.frames.next()
            expect(img.clientTop).to.equal(0)
            expect(img.clientLeft).to.equal(0)

            window.frames.next()
            expect(img.clientTop).to.be.greaterThan(0)
            expect(img.clientTop).to.be.lessThan(document.documentElement.clientHeight / 2)

            expect(img.clientLeft).to.be.greaterThan(0)
            expect(img.clientLeft).to.be.lessThan(document.documentElement.clientWidth / 2)

            finish()
            expect(img.clientTop).to.equal(5) // 50 - 90/2
            expect(img.clientLeft).to.equal(5)
        })
    })
})
