import ImgPopoutElement from './ImgPopoutElement/index.js'
import globalStyle from './global.css'

const globalStyleElement = document.createElement('style')
globalStyleElement.textContent = globalStyle;
(document.head || document.body).appendChild(globalStyleElement)

window.customElements.define(ImgPopoutElement.name, ImgPopoutElement)
window.ImgPopoutElement = ImgPopoutElement
