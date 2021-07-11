const fakeStylesheet = () => ({
    opacity: '1',
})

export class TestElement {
    style = fakeStylesheet()
    clientWidth = 0
    clientHeight = 0

    getBoundingClientRect() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }
    }
}
