/**
 * @typedef {object} FlickrPicture
 * @property {string} link - url of the picture
 * @property {number} size - size of the picture
 */

export default class FlickrService {
  /**
   * Creates an instance of Gallery.
   * @param {string}  apiKey
   * @param {*}       [options]
   * @param {boolean} [options.withCache=true]
   *
   * @memberof Gallery
   */
  constructor (apiKey, { withCache = true } = {}) {
    this.apiKey = `&api_key=${apiKey}`
    this.format = '&format=json&nojsoncallback=1'
    this.photos = 0

    if (withCache && 'caches' in window) {
      // The Cache API is supported
      this.cacheName = 'flickrService'
      this.cache = caches.open(this.cacheName)
      this.withCache = true
    }

    this.search()
  }

  /**
   * @param {API Methods} method
   * @param {any parameters from the API} params
   * @return data from the call
   */
  async apiRequest (method, ...params) {
    const apiParams = params.join('')

    const url = `https://api.flickr.com/services/rest/?method=${method}${this.apiKey}${apiParams}${this.format}`

    let response
    if (this.withCache) {
      const cache = await this.cache
      // If we have cached data
      response = await cache.match(url)
      if (response) {
        return await this.processResponse(url, response)
      }
      // otherwise fetch and cache
      response = await fetch(url)
      await cache.put(url, response.clone())
      return await this.processResponse(url, response)
    }

    response = await fetch(url)
    return await this.processResponse(url, response)
  }

  /**
   *
   * @param {Response} response
   * @return {object} - retrieved json object
   */
  async processResponse (url, response) {
    const data = await response.json()
    if (data.stat === 'fail') {
      if (this.withCache) {
        const cache = await this.cache
        cache.delete(url)
      }

      throw new Error('Ops, something went wrong')
    }

    return data
  }

  /**
   *
   * @param {*} searchInput
   * @param {*} page
   *
   * @returns
   */
  async search (searchInput = '', page = 0) {
    // params reference
    // https://www.flickr.com/services/api/flickr.photos.search.html
    const res = await this.apiRequest(
      `flickr.photos.${searchInput ? 'search' : 'getRecent'}`,
      (searchInput && `&text=${searchInput}`) || undefined,
      '&per_page=25',
      '&safe_search=3',
      `&page=${page}`
    )

    if (!res.photos) {
      return null
    }

    const photos = res.photos.photo
    if (photos.length === 0) {
      return null
    }

    return Promise.all(
      photos.map(async (p) => {
        this.photos++

        const pictures = await this.apiRequest(
          'flickr.photos.getSizes',
          `&photo_id=${p.id}`
        )

        if (
          !pictures.sizes ||
          !pictures.sizes.size ||
          !pictures.sizes.size.length
        ) {
          return null
        }

        const sizeCnt = pictures.sizes.size.length
        const quality = Math.floor(sizeCnt / 2) // grab medium quality
        const maxSize = pictures.sizes.size[quality].width

        return {
          link: pictures.sizes.size[quality].source,
          size: maxSize
        }
      })
    )
  }
}
