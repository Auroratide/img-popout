import html from './template.html'
import style from './style.css'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${html}`

class ImgPopoutElement extends HTMLElement {
    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true))
        
        this.elements = {
            mainSlot: this.shadowRoot.getElementById('main-slot')
        }
    }

    connectedCallback() {
        const node = this.elements.mainSlot.assignedElements()[0].cloneNode(true)
        node.slot = 'popped-out'
        this.shadowRoot.host.appendChild(node)
    }
}

window.customElements.define('img-popout', ImgPopoutElement)
