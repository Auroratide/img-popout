import { runAnimation, reverseOf } from '../animations.js'
import { popout } from './animations.js'
import html from './template.html'
import style from './style.css'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${html}`

export default class ImgPopoutElement extends HTMLElement {
    static name = 'img-popout'

    static defaultTransitions = {
        out: popout,
        in: null,
    }

    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true))
        
        this.elements = {
            main: this.shadowRoot.querySelector('#main'),
            mainSlot: this.shadowRoot.querySelector('#main slot'),
            cover: this.shadowRoot.querySelector('#cover'),
            coverSlot: this.shadowRoot.querySelector('#cover slot')
        }

        this.observer = new MutationObserver(this.duplicatePrimaryImage.bind(this))

        this.transition = {
            out: null,
            in: null,
        }

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
        document.body.removeEventListener('keyup', this.escapeListener)
    }

    popout() {
        this.showCover()
        this.stopScroll()
        document.body.addEventListener('keyup', this.escapeListener)

        this.elements.cover.focus({ preventScroll: true })
    }

    popin() {
        this.hideCover()
        this.resumeScroll()
        document.body.removeEventListener('keyup', this.escapeListener)

        this.elements.main.focus({ preventScroll: true })
    }

    duplicatePrimaryImage() {
        if (!this.mainImage())
            return; // no primary image to clone

        this.elements.coverSlot.innerHTML = ''

        const node = this.mainImage().cloneNode(true)
        if (node.alt) {
            node.alt = `${node.alt} (enlarged)`
        }

        this.elements.coverSlot.appendChild(node)
    }

    attachListeners() {
        this.elements.main.onclick = this.popout.bind(this)
        this.elements.main.addEventListener('keyup', (e) => {
            if (e.key === 'Enter')
                this.popout()
        })
        this.elements.cover.onclick = this.popin.bind(this)
        this.elements.cover.addEventListener('keyup', (e) => {
            if (e.key === 'Enter')
                this.popin()
        })
        this.elements.mainSlot.addEventListener('slotchange', () => {
            this.attachObservers()
            this.duplicatePrimaryImage()
        })
    }

    attachObservers() {
        if (this.mainImage()) {
            this.observer.observe(this.mainImage(), {
                attributes: true,
            })
        }
    }

    showCover() {
        this.elements.cover.hidden = false

        this.runTransition(this.outTransition())
    }

    hideCover() {
        this.elements.cover.hidden = true

        this.runTransition(this.inTransition())
    }

    stopScroll() {
        document.body.style.top = `-${window.scrollY}px`
        document.body.classList.add('img-popout_stopscroll')
    }

    resumeScroll() {
        document.body.classList.remove('img-popout_stopscroll')
        window.scrollTo(0, parseInt(document.body.style.top || '0') * -1)
    }

    runTransition(transition) {
        runAnimation(Object.assign({}, transition, {
            initialize: (ctx) => {
                if (transition.initialize)
                    transition.initialize(ctx)
                this.elements.cover.classList.add('animating')
            },
            finalize: (ctx) => {
                if (transition.finalize)
                    transition.finalize(ctx)
                this.elements.cover.classList.remove('animating')
            }
        }))
    }

    mainImage() {
        const elems = this.elements.mainSlot.assignedElements()
        return elems.length > 0 ? elems[0] : null
    }

    coverImage() {
        const elems = this.elements.coverSlot.assignedElements()
        return elems.length > 0 ? elems[0] : this.elements.coverSlot.firstChild
    }

    outTransition() {
        return (this.transition.out ? this.transition.out : ImgPopoutElement.defaultTransitions.out)
            (this.elements.cover, this.coverImage(), this.mainImage())
    }

    inTransition() {
        const t = this.transition.in ? this.transition.in : ImgPopoutElement.defaultTransitions.in
        return t ? t(this.elements.cover, this.coverImage(), this.mainImage()) : reverseOf(this.outTransition())
    }
}
