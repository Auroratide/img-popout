import { runAnimation, reverseOf } from '../animations.js'
import html from './template.html'
import style from './style.css'

const template = document.createElement('template')
template.innerHTML = `<style>${style}</style>${html}`

export default class ImgPopoutElement extends HTMLElement {
    static name = 'img-popout'

    static defaultTransitions = {
        in: (cover, img, main) => ({
            duration: 400,
            easing: (t) => 1 - (1 - t) * (1 - t),
            context: () => ({
                rect: main.getBoundingClientRect(),
                vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            }),
            initialize: (ctx) => {
                img.style.minWidth = `${ctx.rect.right - ctx.rect.left}px`
                img.style.minHeight = `${ctx.rect.bottom - ctx.rect.top}px`
                img.style.maxWidth = `${ctx.rect.right - ctx.rect.left}px`
                img.style.maxHeight = `${ctx.rect.bottom - ctx.rect.top}px`
            },
            tick: (t, ctx) => {
                const r = ctx.rect
                const w = r.right - r.left
                const h = r.bottom - r.top
                cover.style.opacity = (Math.min(t * 1.5, 1)).toString()

                img.style.top = `${t * (ctx.vh / 2 - r.top) + r.top}px`
                img.style.left = `${t * (ctx.vw / 2 - r.left) + r.left}px`
                img.style.maxWidth = `${t * (ctx.vw * 0.9 - w) + w}px`
                img.style.maxHeight = `${t * (ctx.vh * 0.9 - h) + h}px`
                img.style.minWidth = `${w * (1 - t)}px`
                img.style.minHeight = `${h * (1 - t)}px`
                img.style.transform = `translate(-${t * 50}%, -${t * 50}%)`
            },
            finalize: () => {
                img.style.top = '50%'
                img.style.left = '50%'
                img.style.transform = 'translate(-50%, -50%)'
                img.style.maxWidth = '90vw'
                img.style.maxHeight = '90vh'
                img.style.minWidth = '0'
                img.style.minHeight = '0'
            }
        }),
        out: null,
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

        this.transition = Object.assign({}, ImgPopoutElement.defaultTransitions)

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
        
        const assignedToPoppedOut = this.elements.coverSlot.assignedElements()
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
        this.elements.main.onclick = this.popout.bind(this)
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

        this.runTransition(this.transition.in(this.elements.cover, this.poppedOutImage(), this.mainImage()))
    }

    hideCover() {
        this.elements.cover.classList.remove('show')

        if (this.transition.out)
            this.runTransition(this.transition.out(this.elements.cover, this.poppedOutImage(), this.mainImage()))
        else
            this.runTransition(reverseOf(this.transition.in(this.elements.cover, this.poppedOutImage(), this.mainImage())))
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

    poppedOutImage() {
        const elems = this.elements.coverSlot.assignedElements()
        return elems.length > 0 ? elems[0] : null
    }
}
