require('./_global')

const popout = window.ImgPopoutElement.defaultTransitions.in

const setActivated = (selector, name) => {
    const elems = document.querySelectorAll(selector)
    for (let elem of elems) {
        elem.classList.remove('activated')
    }

    document.getElementById(name).classList.add('activated')
}

document.querySelector('#use-spin').onclick = () => {
    setActivated('#custom-default-transitions button', 'use-spin')
    useSpin()
}

document.querySelector('#use-popout').onclick = () => {
    setActivated('#custom-default-transitions button', 'use-popout')
    ImgPopoutElement.defaultTransitions.in = popout
}
