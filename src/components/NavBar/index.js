import style from './style.scss'
import template from './template.html'

class Navbar extends HTMLElement {
  constructor () {
    super()
    const templateEl = document.createElement('template')
    templateEl.innerHTML = template

    const styleEl = document.createElement('style')
    styleEl.appendChild(document.createTextNode(style))

    // create indipendent DOM
    const shadowRoot = this.attachShadow({ mode: 'closed' })
    shadowRoot.appendChild(templateEl.content.cloneNode(true))
    shadowRoot.appendChild(styleEl)

    this.shadowDom = shadowRoot
  }

  connectedCallback () {
    // Search on enter press
    var searchBox = this.shadowDom.querySelector('.search-box')

    // Execute a function when the user releases a key on the keyboard
    searchBox.addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('search', {
          detail: searchBox.value
        }))
      }
    })

    // Search on enter press
    var searchBtn = this.shadowDom.querySelector('.search-button')

    // Execute a function when the user releases a key on the keyboard
    searchBtn.addEventListener('click', (event) => {
      this.dispatchEvent(new CustomEvent('search', {
        detail: searchBox.value
      }))
    })
  }
}

customElements.define('flickr-navbar', Navbar)

export default Navbar
