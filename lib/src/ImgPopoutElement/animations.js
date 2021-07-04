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

const fillScreen = (img, r, vw, vh, t) => {
    const w = r.right - r.left
    const h = r.bottom - r.top
    img.style.maxWidth = `${t * (vw * 0.9 - w) + w}px`
    img.style.maxHeight = `${t * (vh * 0.9 - h) + h}px`
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

export const popout = (cover, img, main) => ({
    duration: 400,
    easing: easeOut,
    context: () => ({
        rect: main.getBoundingClientRect(),
        vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    }),
    initialize: (ctx) => {
        matchDimensions(img, ctx.rect)
    },
    tick: (t, ctx) => {
        fade(cover, t * 1.5)
        moveTowardCenter(img, ctx.rect, ctx.vw, ctx.vh, t)
        fillScreen(img, ctx.rect, ctx.vw, ctx.vh, t)
    },
    finalize: () => {
        responsivelyCenter(img)
    },
})
