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
        
        const image = this.shadowRoot.getElementById('image')
        const mainSlot = image.querySelector('slot')
        const cover = this.shadowRoot.getElementById('cover')
        const poppedOutSlot = cover.querySelector('slot')

        this.elements = { image, mainSlot, cover, poppedOutSlot }
    }

    connectedCallback() {
        if (this.elements.poppedOutSlot.assignedElements().length === 0) {
            this.duplicatePrimaryImage()
        }

        this.attachListeners()
    }

    popout() {
        this.elements.cover.classList.add('show')
    }

    popin() {
        this.elements.cover.classList.remove('show')
    }

    duplicatePrimaryImage() {
        const node = this.elements.mainSlot.assignedElements()[0].cloneNode(true)
        node.slot = 'popped-out'
        if (node.alt) {
            node.alt = `${node.alt} (enlarged)`
        }
        this.shadowRoot.host.appendChild(node)
    }

    attachListeners() {
        this.elements.image.onclick = this.popout.bind(this)
        this.elements.cover.onclick = this.popin.bind(this)
    }
}

window.customElements.define('img-popout', ImgPopoutElement)
