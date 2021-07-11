export class TestWindow {
    time = 0
    timeIncrement = 1
    functions = []
    frames = function*() {
        while(true) {
            const fns = [...this.functions]
            this.functions = []

            while (fns.length > 0)
                fns.shift()(this.time)
            this.time += this.timeIncrement
            yield null
        }
    }.bind(this)()

    performance = {
        now: () => this.time
    }

    requestAnimationFrame = (fn) => {
        this.functions.push(fn)
        return 0
    }
}
