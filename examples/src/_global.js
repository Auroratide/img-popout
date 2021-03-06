const hljs = require('highlight.js')

const html = `
    <section>
        <h2 id="title"></h2>
        <div id="content"><slot></slot></div>
        <pre><code id="code"></code></pre>
        <aside id="additional"><slot name="additional"></slot></aside>
    </section>
`

const css = `
    :host {
        display: block;
    }

    * {
        margin: 0;
    }

    section {
        display: grid;
        grid-template-areas:
            "title"
            "content"
            "code"
            "additional";
        grid-gap: 1em;
    }

    #title {
        grid-area: title;
    }
    
    #content {
        grid-area: content;
    }
    
    pre {
        grid-area: code;
        overflow: auto;
    }

    #additional {
        grid-area: additional;
    }

    code {
        font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
        font-size: 85%;
    }

    pre code {
        display: block;
        line-height: 1.5em;
        border: 0.0625rem solid rgb(var(--color-primary));
        border-left-width: 0.375rem;
        padding: 0 1em;
        overflow: auto;
        background: var(--color-fg);
        background-image: linear-gradient(transparent 50%, rgba(var(--color-primary), 0.06) 50%);
        background-size: 3em 3em;
        border-radius: 0;
    }

    .hljs-name,
    .hljs-selector-class { color: #0080aa; }
    .hljs-attr,
    .hljs-keyword { color: #0060ff; }
    .hljs-string { color: #a31515; }
    .hljs-built_in { font-weight: bold; }
    .hljs-number { color: #a85f30; }

    @media screen and (min-width: 75rem) {
        section {
            grid-template-areas:
                "title title"
                "content code"
                "content additional";
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-rows: auto auto 1fr;
        }
    }
`

const template = document.createElement('template')
template.innerHTML = `<style>${css}</style>${html}`

class CodeDemoElement extends HTMLElement {
    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.shadowRoot.getElementById('title').textContent = this.title
        this.shadowRoot.getElementById('code').innerHTML = hljs.highlight(this.code(), {
            language: 'xml'
        }).value
    }

    static get observedAttributes() {
        return ['title'];
    }
      
    attributeChangedCallback() {
        this.shadowRoot.getElementById('title').textContent = this.title
    }

    get title() { return this.getAttribute('title') }
    set title(value) { this.setAttribute('title', value) }

    code() {
        const lines = this.shadowRoot.host.innerHTML.split('\n')
        if (lines[0].match(/^\s*$/))
            lines.shift()
        if (lines[lines.length - 1].match(/^\s*$/))
            lines.pop()
        
        const indentSize = lines[0].match(/^\s*/)[0].length
        
        return lines.map(line => line.substring(indentSize)).join('\n')
    }
}

window.customElements.define('code-demo', CodeDemoElement)

require('@auroratide/img-popout')
