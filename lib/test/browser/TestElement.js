const fakeStylesheet = () => ({
    position: 'absolute', // for the tests, position always absolute is sufficient
    opacity: '1',
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: 'none',
    minHeight: 'none',
    top: '0',
    left: '0',
    transform: 'none',
})

export class TestElement {
    style = fakeStylesheet()

    constructor({
        width = 0,
        height = 0,
    } = {}) {
        this.style.width = `${width}px`
        this.style.height = `${height}px`
    }

    get clientWidth() {
        const w = parseFloat(this.style.width) || 0
        const min = parseFloat(this.style.minWidth) || 0
        const max = parseFloat(this.style.maxWidth) || Infinity
        return Math.min(Math.max(w, min), max)
    }

    get clientHeight() {
        const h = parseFloat(this.style.height) || 0
        const min = parseFloat(this.style.minHeight) || 0
        const max = parseFloat(this.style.maxHeight) || Infinity
        return Math.min(Math.max(h, min), max)
    }

    get clientTop() {
        let t = parseFloat(this.style.top)
        const translate = this.style.transform.match(/translate\((-?.+%),\s*(-?.+%)\)/)
        if (translate) {
            t = t + this.clientHeight * parseFloat(translate[2]) / 100
        }

        return t
    }

    get clientLeft() {
        let l = parseFloat(this.style.left)
        const translate = this.style.transform.match(/translate\((-?.+%),\s*(-?.+%)\)/)
        if (translate) {
            l = l + this.clientWidth * parseFloat(translate[1]) / 100
        }

        return l
    }

    getBoundingClientRect() {
        return {
            top: this.clientTop,
            right: this.clientLeft + this.clientWidth,
            bottom: this.clientTop + this.clientHeight,
            left: this.clientLeft,
        }
    }
}
