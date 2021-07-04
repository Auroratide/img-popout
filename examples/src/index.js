require('./_global')

const popout = window.ImgPopoutElement.defaultTransitions.in

document.querySelector('#use-popout').onclick = () => {
    ImgPopoutElement.defaultTransitions.in = popout
}
