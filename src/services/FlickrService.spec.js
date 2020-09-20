import FlickrService from './FlickrService'

describe('Flickr Service', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  class CacheAPI {
    constructor () {
      this.cache = {}
    }

    put (url, response) {
      this.cache[url] = response
    }

    match (url) {
      return this.cache[url]
    }

    delete (url) {
      delete this.cache[url]
    }
  }
  CacheAPI.open = () => new CacheAPI()
  global.caches = CacheAPI

  it('FlickrService Constructor with default', async () => {
    const flickrService = new FlickrService('fakeApi')

    expect(flickrService.cacheName).toEqual('flickrService')
  })

  it('FlickrService Constructor with cache', async () => {
    const flickrService = new FlickrService('fakeApi', { withCache: true })

    expect(flickrService.cacheName).toEqual('flickrService')

    fetch.mockResponse(JSON.stringify({ stat: 'fail' }))

    let error
    try {
      await flickrService.search('cat', 0)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(new Error('Ops, something went wrong'))

    // run the mocked fetch
    fetch.mockResponse(JSON.stringify({ photos: { photo: [] } }))
    let res = await flickrService.search('cat', 0)
    expect(res).toEqual(null)

    // get from cache
    fetch.mockResponse(JSON.stringify({ photos: { photo: [] } }))
    res = await flickrService.search('cat', 0)
    expect(res).toEqual(null)
  })

  it('FlickrService Constructor without cache', async () => {
    const flickrService = new FlickrService('fakeApi', { withCache: false })

    expect(flickrService).toBeInstanceOf(FlickrService)

    expect(flickrService.cacheName).toEqual(undefined)

    fetch.mockResponse(JSON.stringify({ stat: 'fail' }))

    let error
    try {
      await flickrService.search('cat', 0)
    } catch (e) {
      error = e
    }

    expect(error).toEqual(new Error('Ops, something went wrong'))

    // run the mocked fetch
    fetch.mockResponseOnce(JSON.stringify({ photos: null }))
    let res = await flickrService.search('cat', 0)
    expect(res).toEqual(null)

    fetch.mockResponse(
      JSON.stringify({
        photos: {
          photo: [
            {
              id: 1
            }
          ]
        }
      })
    )
    res = await flickrService.search('cat', 0)
    expect(res).toEqual([null])

    fetch.resetMocks()
    fetch
      .once(
        JSON.stringify({
          photos: {
            photo: [
              {
                id: 1
              }
            ]
          }
        })
      )
      .once(
        JSON.stringify({
          sizes: {
            size: [
              {
                width: 100,
                source: 'dummy'
              }
            ]
          }
        })
      )

    res = await flickrService.search('cat', 0)
    expect(res).toEqual([{ link: 'dummy', size: 100 }])
  })
})
