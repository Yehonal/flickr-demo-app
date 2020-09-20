import style from './style.scss'
import template from './template.html'
import FlickrService from '@this/services/FlickrService'

class Gallery extends HTMLElement {
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
    this.galleryDom = this.shadowDom.querySelector('.gallery-container')
    this.loaderDom = this.shadowDom.querySelector('.loader-container')
    this.currentPage = 1
    this.searchText = ''

    // start flickr service
    this.flickrService = new FlickrService('b677ef7079db7d97229cca2d509a76a5')

    // listen for events that dispatch the search function
    const navbar = document.querySelector('flickr-navbar')
    if (navbar) {
      navbar.addEventListener('search', (e) => {
        this.searchPictures(e.detail)
      }, false)
    }
  }

  async loadPictures (search = '', page = 0, reset = false) {
    if (reset) {
      this.galleryDom.innerHTML = ''
    }

    const loader = document.createElement('div')
    loader.classList = ['loader']
    this.loaderDom.prepend(loader)
    const loaderText = this.loaderDom.querySelector('.loader-text')

    let promise
    try {
      promise = await this.flickrService.search(search, page)
    } catch (e) {
      loaderText.innerHTML = `Ops! Error occurred: ${e}`
      return
    }

    setTimeout(() => {
      if (promise) {
        loaderText.innerHTML = 'The service seems unresponse. Please, try again later'
      }
    }, 5000)

    const pictures = await promise
    promise = null

    if (!pictures) {
      loaderText.innerHTML = 'No pictures found!'
      return
    }

    // clean loader and text
    this.loaderDom.removeChild(loader)
    this.loaderDom.querySelector('.loader-text').innerHTML = ''

    pictures.map((p, k) => {
      if (!p) { return }

      const imgHolder = document.createElement('div')
      imgHolder.classList = ['img-holder']

      const imgEl = document.createElement('img')
      imgEl.src = p.link

      imgHolder.appendChild(imgEl)
      this.galleryDom.appendChild(imgHolder)
    })
  }

  async searchPictures (search) {
    this.currentPage = 1
    this.searchText = search
    this.loadPictures(this.searchText, this.currentPage, true)
  }

  galleryHandler () {
    this.loadPictures(this.searchText, this.currentPage)
    // Detect when scrolled to bottom.
    document.addEventListener('scroll', async () => {
      const scrollHeight = document.body.clientHeight
      const scrollPos = document.documentElement.clientHeight + document.documentElement.scrollTop
      const scrollRatio  = (scrollHeight - scrollPos) / scrollHeight;

      // less then 5%
      if (scrollRatio * 100 < 5) {
        this.currentPage++
        await this.loadPictures(this.searchText, this.currentPage)
      }
    })
  }

  async connectedCallback () {
    this.galleryHandler()
  }

  onSearch () {

  }
}

customElements.define('flickr-gallery', Gallery)

export default Gallery
