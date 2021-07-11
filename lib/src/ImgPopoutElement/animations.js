const easeOut = (t) => 1 - (1 - t) * (1 - t)

const matchDimensions = (img, rect) => {
    img.style.minWidth = `${rect.right - rect.left}px`
    img.style.minHeight = `${rect.bottom - rect.top}px`
    img.style.maxWidth = `${rect.right - rect.left}px`
    img.style.maxHeight = `${rect.bottom - rect.top}px`
}

const fade = (elem, t) => elem.style.opacity = Math.min(Math.max(t, 0), 1).toString()

const moveTowardCenter = (img, r, vw, vh, t) => {
    img.style.top = `${t * (vh / 2 - r.top) + r.top}px`
    img.style.left = `${t * (vw / 2 - r.left) + r.left}px`
    img.style.transform = `translate(-${t * 50}%, -${t * 50}%)`
}

const fillScreen = (img, r, tw, th, t) => {
    const w = r.right - r.left
    const h = r.bottom - r.top
    img.style.maxWidth = `${t * (tw - w) + w}px`
    img.style.maxHeight = `${t * (th - h) + h}px`
    img.style.minWidth = `${w * (1 - t)}px`
    img.style.minHeight = `${h * (1 - t)}px`
}

const responsivelyCenter = (img) => {
    img.style.top = '50%'
    img.style.left = '50%'
    img.style.transform = 'translate(-50%, -50%)'
    img.style.maxWidth = '90vw'
    img.style.maxHeight = '90vh'
    img.style.minWidth = '0'
    img.style.minHeight = '0'
}

export const popout = (cover, img, main, doc = document, win = window) => ({
    duration: 400,
    easing: easeOut,
    context: () => {
        const vw = Math.max(doc.documentElement.clientWidth || 0, win.innerWidth || 0)
        const vh = Math.max(doc.documentElement.clientHeight || 0, win.innerHeight || 0)

        return {
            rect: main.getBoundingClientRect(),
            vw,
            vh,
            targetW: Math.min(0.9 * vw, img.naturalWidth),
            targetH: Math.min(0.9 * vh, img.naturalHeight),
        }
    },
    initialize: (ctx) => {
        matchDimensions(img, ctx.rect)
    },
    tick: (t, ctx) => {
        fade(cover, t * 1.5)
        moveTowardCenter(img, ctx.rect, ctx.vw, ctx.vh, t)
        fillScreen(img, ctx.rect, ctx.targetW, ctx.targetH, t)
    },
    finalize: () => {
        responsivelyCenter(img)
    },
})
