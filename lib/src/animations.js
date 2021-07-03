export const runAnimation = ({
    duration = null,
    easing = (t) => t,
    context = () => ({}),
    initialize = () => {},
    tick = null,
    finalize = () => {}
}, win = window) => {
    if (!duration || !tick) {
        console.error('ERROR: runAnimation requires an animation specification with `duration` and `tick` defined.')
        return
    }

    const ctx = context()
    initialize(ctx)
    const start = win.performance.now()
    const loop = (timestamp) => {
        const t = Math.min(Math.max((timestamp - start) / duration, 0), 1)
        tick(easing(t), ctx)

        if (t < 1) {
            win.requestAnimationFrame(loop)
        } else {
            finalize(ctx)
        }
    }

    win.requestAnimationFrame(loop)
}

export const reverseOf = (original) => ({
    duration: original.duration,
    easing: (t) => 1 - (original.easing || (t => t))(t),
    context: original.context,
    initialize: original.finalize,
    tick: original.tick,
    finalize: original.initialize,
})
