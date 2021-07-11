const fakeStylesheet = () => ({
    opacity: '1',
    width: 'auto',
    height: 'auto',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: 'none',
    minHeight: 'none',
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

    getBoundingClientRect() {
        return {
            top: 0,
            right: this.clientWidth,
            bottom: this.clientHeight,
            left: 0,
        }
    }
}
