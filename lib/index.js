class ImgPopoutElement extends HTMLElement {
    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .appendChild(document.createTextNode('Hello World'))
    }
}

window.customElements.define('img-popout', ImgPopoutElement)
