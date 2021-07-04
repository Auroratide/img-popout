require('./_global')

const popout = window.ImgPopoutElement.defaultTransitions.out

const setActivated = (selector, name) => {
    const elems = document.querySelectorAll(selector)
    for (let elem of elems) {
        elem.removeAttribute('disabled')
    }

    document.getElementById(name).disabled = true
}

document.querySelector('#use-spin').onclick = () => {
    setActivated('#custom-default-transitions button', 'use-spin')
    useSpin()
}

document.querySelector('#use-popout').onclick = () => {
    setActivated('#custom-default-transitions button', 'use-popout')
    ImgPopoutElement.defaultTransitions.out = popout
}
