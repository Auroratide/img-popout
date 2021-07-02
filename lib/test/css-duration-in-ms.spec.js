import cssDurationInMs from '../src/css-duration-in-ms.js'
import { expect } from 'chai'

describe('css duration in ms', () => {
    it('zero', () => {
        expect(cssDurationInMs('0')).to.equal(0)
    })

    it('seconds', () => {
        expect(cssDurationInMs('1s')).to.equal(1000)
        expect(cssDurationInMs('2s')).to.equal(2000)
    })

    it('milliseconds', () => {
        expect(cssDurationInMs('12ms')).to.equal(12)
        expect(cssDurationInMs('34ms')).to.equal(34)
    })

    it('decimals', () => {
        expect(cssDurationInMs('.4s')).to.equal(400)
        expect(cssDurationInMs('0.6s')).to.equal(600)
        expect(cssDurationInMs('1.6s')).to.equal(1600)
    })

    it('empty', () => {
        expect(cssDurationInMs('')).to.equal(0)
        expect(cssDurationInMs(null)).to.equal(0)
        expect(cssDurationInMs(undefined)).to.equal(0)
    })

    it('invalid', () => {
        expect(cssDurationInMs('s')).to.equal(0)
        expect(cssDurationInMs('ms')).to.equal(0)
        expect(cssDurationInMs('.')).to.equal(0)
        expect(cssDurationInMs('hello')).to.equal(0)
    })
})