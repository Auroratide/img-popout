import { TestElement } from './TestElement.js'

export class TestDocument {
    documentElement

    constructor({
        width = 800,
        height = 600,
    } = {}) {
        this.documentElement = new TestElement({
            width,
            height,
        })
    }
}
