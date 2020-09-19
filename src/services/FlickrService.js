/**
 * @typedef {object} FlickrPicture
 * @property {string} link - url of the picture
 * @property {number} size - size of the picture
 */

export default class FlickrService {
  /**
   * Creates an instance of Gallery.
   * @param {String} _apiKey
   * @memberof Gallery
   */
  constructor (apiKey) {
    this.apiKey = `&api_key=${apiKey}`
    this.format = '&format=json&nojsoncallback=1'
    this.photos = 0
    this.search()
  }

  /**
   * @param {API Methods} _method
   * @param {any parameters from the API} _params
   * @return data from the call
   */
  async apiRequest (method, ...params) {
    const apiParams = params.join('')

    const flickrApi = await fetch(`
        https://api.flickr.com/services/rest/?method=${method}${this.apiKey}${apiParams}${this.format}`)
    const data = await flickrApi.json()

    if (data.stat === 'fail') {
      throw new Error('Ops, something went wrong')
    } else {
      return data
    }
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
      `flickr.photos.${searchInput? 'search' : 'getRecent'}`,
      searchInput && `&text=${searchInput}` || undefined,
      '&per_page=25',
      `&page=${page}`
    )

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
        const quality = pictures.sizes.size.length - 1 // grab original size
        const maxSize = pictures.sizes.size[quality].width

        return {
          link: pictures.sizes.size[quality].source,
          size: maxSize
        }
      })
    )
  }
}
