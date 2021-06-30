class ImgPopoutElement extends HTMLElement {
    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .innerHTML = "<slot></slot>"
    }
}

window.customElements.define('img-popout', ImgPopoutElement)
