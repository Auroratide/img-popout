export const popout = (cover, img, main) => ({
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
})