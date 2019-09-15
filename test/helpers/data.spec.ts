import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a PlainObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })
    test('should do nothing if data is not a PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })
  describe('transformResponse', () => {
    test('should transform response data to Object if data is a JSON string', () => {
      expect(transformResponse('{"a": 1}')).toEqual({ a: 1 })
    })
    test('should do nothing if data is a string but is a not JSON string', () => {
      expect(transformResponse('{a: 1}')).toEqual('{a: 1}')
    })
    test('should do nothing if data is not string', () => {
      expect(transformResponse({ a: 1 })).toEqual({ a: 1 })
    })
  })
})
