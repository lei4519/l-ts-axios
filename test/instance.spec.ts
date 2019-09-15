import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from '../src/index'
import { getAjaxRequest } from './helpers'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  test('should make a http request without verb helper', () => {
    const instance = axios.create()
    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })
  test('should make a http request', () => {
    const instance = axios.create()
    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('get')
    })
  })
  test('should make a post request', () => {
    const instance = axios.create()
    instance.post('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('post')
    })
  })
  test('should make a put request', () => {
    const instance = axios.create()
    instance.put('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('put')
    })
  })
  test('should make a patch request', () => {
    const instance = axios.create()
    instance.patch('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('patch')
    })
  })
  test('should make a head request', () => {
    const instance = axios.create()
    instance.head('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('head')
    })
  })
  test('should make a delete request', () => {
    const instance = axios.create()
    instance.delete('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('delete')
    })
  })
  test('should use instance options', () => {
    const instance = axios.create({ timeOut: 1000 })
    instance.get('/foo')

    return getAjaxRequest().then(request => {
      expect(request.timeout).toBe(1000)
    })
  })
  test('should have defaults.headers', () => {
    const instance = axios.create({ baseURL: 'https://api.example.com' })

    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })
  test('should have interceptors on the instance', done => {
    axios.interceptors.request.use(config => {
      config.timeOut = 2000
      return config
    })
    const instance = axios.create()
    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })
    let response: AxiosResponse
    instance.get('/foo').then(res => (response = res))
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200
      })
      setTimeout(() => {
        expect(response.request.timeout).toBeUndefined()
        expect(response.request.withCredentials).toBeTruthy()
        done()
      }, 100)
    })
  })
  test('should get the computed uri', () => {
    const fakeConfig: AxiosRequestConfig = {
      baseURL: 'https://www.baidu.com/',
      url: '/user/123',
      params: {
        idClient: 1,
        idTest: 2,
        testString: 'thisIsATest'
      }
    }
    expect(axios.getURI(fakeConfig)).toBe(
      'https://www.baidu.com/user/123?idClient=1&idTest=2&testString=thisIsATest'
    )
  })
})
