import html from './template.html'
import style from './style.css'
import globalStyle from './global.css'

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

        this.escapeListener = (e) => {
            if (e.key === 'Escape')
                this.popin()
        }
    }

    connectedCallback() {
        this.attachListeners()
    }

    popout() {
        this.showCover()
        this.stopScroll()
        document.body.addEventListener('keyup', this.escapeListener)
    }

    popin() {
        this.hideCover()
        this.resumeScroll()
        document.body.removeEventListener('keyup', this.escapeListener)
    }

    duplicatePrimaryImage() {
        if (this.elements.mainSlot.assignedElements().length === 0)
            return; // no primary image to clone
        
        if (this.elements.poppedOutSlot.assignedElements().length > 0)
            return; // the popped out slot is already populated

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
        this.elements.mainSlot.addEventListener('slotchange', this.duplicatePrimaryImage.bind(this))
    }

    showCover() {
        this.elements.cover.classList.add('show')
    }

    hideCover() {
        this.elements.cover.classList.add('hide')
        this.elements.cover.classList.remove('show')

        setTimeout(() => this.elements.cover.classList.remove('hide'), this.animationDuration())
    }

    stopScroll() {
        document.body.style.top = `-${window.scrollY}px`
        document.body.classList.add('img-popout_stopscroll')
    }

    resumeScroll() {
        document.body.classList.remove('img-popout_stopscroll')
        window.scrollTo(0, parseInt(document.body.style.top || '0') * -1)
    }

    animationDuration() {
        let duration = 0

        const rawDuration = getComputedStyle(this.elements.cover).animationDuration
        const durationNumberMatch = rawDuration.match(/\d+\.?\d*/)
        if (durationNumberMatch) {
            duration = parseFloat(durationNumberMatch[0])

            const unit = rawDuration.substring(durationNumberMatch[0].length)
            if (unit === 's') {
                duration *= 1000
            }
        }

        return duration
    }
}

const globalStyleElement = document.createElement('style')
globalStyleElement.textContent = globalStyle;
(document.head || document.body).appendChild(globalStyleElement)

window.customElements.define('img-popout', ImgPopoutElement)
