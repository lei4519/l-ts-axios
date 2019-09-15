import { flattenHeaders, parseHeaders, processHeaders } from '../../src/helpers/header'

describe('helpers:headers', () => {
  describe('processHeaders', () => {
    test('should return headers if headers is not a plainObject', () => {
      const header = ''
      const data = {}
      expect(processHeaders(header, data)).toBe(header)
    })
    test('should add content-type if headers not a content-type', () => {
      const header = {}
      const data = {}
      expect(processHeaders(header, data)).toHaveProperty('Content-Type')
    })
    test('should convert content-type if headers has a content-type but not normalize', () => {
      const header = { 'content-type': 'text/html' }
      const data = {}
      expect(processHeaders(header, data)).toHaveProperty('Content-Type')
      expect(processHeaders(header, data)).not.toHaveProperty('content-type')
    })
    test('should do nothing if data is not a plainObject', () => {
      const header = { foo: 1 }
      const data = 'a=1'
      expect(processHeaders(header, data)).toBe(header)
    })
  })
  describe('parseHeaders', () => {
    test('should return empty object if headers is empty', () => {
      expect(parseHeaders('')).toEqual({})
    })
    test('should parse headers if headers is not empty string', () => {
      expect(
        parseHeaders(`
        time: 2019:03:07
        Content-Type: text/html
        Keep-Alive: connect
      `)
      ).toEqual({
        'content-type': 'text/html',
        'keep-alive': 'connect',
        time: '2019:03:07'
      })
    })
  })
  describe('flattenHeaders', () => {
    test('should return headers if headers is falsy', () => {
      const headers = [null, undefined, '', 0]
      headers.forEach(header => {
        expect(flattenHeaders(header, 'get')).toBe(header)
      })
    })
    test('should flatten headers and remove common and method property and not has other method, ', () => {
      const header = {
        common: { a: 1 },
        get: {
          b: 2
        },
        c: 3,
        post: {
          d: 3
        }
      }
      expect(flattenHeaders(header, 'get')).toEqual({
        a: 1,
        b: 2,
        c: 3
      })
    })
  })
})
