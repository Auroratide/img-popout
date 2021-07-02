import cssDurationInMs from '../css-duration-in-ms.js'
import html from './template.html'
import style from './style.css'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${html}`

export default class ImgPopoutElement extends HTMLElement {
    static name = 'img-popout'

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
        this.observer = new MutationObserver(this.duplicatePrimaryImage.bind(this))

        this.escapeListener = (e) => {
            if (e.key === 'Escape')
                this.popin()
        }
    }

    connectedCallback() {
        this.attachListeners()
        this.attachObservers()
    }

    disconnectedCallback() {
        this.observer.disconnect()
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
        
        const assignedToPoppedOut = this.elements.poppedOutSlot.assignedElements()
        if (assignedToPoppedOut.length > 0 && !assignedToPoppedOut[0].dataset.duplicated)
            return; // the popped out slot is already populated by the user

        assignedToPoppedOut.forEach((elem) => elem.parentNode.removeChild(elem))

        const node = this.mainImage().cloneNode(true)
        node.slot = 'popped-out'
        if (node.alt) {
            node.alt = `${node.alt} (enlarged)`
        }
        node.dataset.duplicated = true
        this.shadowRoot.host.appendChild(node)
    }

    attachListeners() {
        this.elements.image.onclick = this.popout.bind(this)
        this.elements.cover.onclick = this.popin.bind(this)
        this.elements.mainSlot.addEventListener('slotchange', () => {
            this.attachObservers()
            this.duplicatePrimaryImage()
        })
    }

    attachObservers() {
        this.observer.observe(this.mainImage(), {
            attributes: true,
        })
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
        return cssDurationInMs(getComputedStyle(this.elements.cover).animationDuration)
    }

    mainImage() {
        const elems = this.elements.mainSlot.assignedElements()
        return elems.length > 0 ? elems[0] : null
    }
}
