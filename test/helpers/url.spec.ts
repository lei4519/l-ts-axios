import { buildURL, combineURL, isAbsoluteURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(buildURL('/foo', { bar: 123 })).toBe('/foo?bar=123')
    })
    test('should ignore if some param value is null', () => {
      expect(buildURL('/foo', { a: 1, b: null })).toBe('/foo?a=1')
    })
    test('should ignore if the only param value is null', () => {
      expect(buildURL('/foo', { b: null })).toBe('/foo')
    })
    test('should support object params', () => {
      expect(buildURL('/foo', { foo: { bar: 123 } })).toBe('/foo?foo=' + encodeURI('{"bar":123}'))
    })
    test('should support array params', () => {
      let url = 'http://www.baidu.com'
      let params = {
        a: [1, 2]
      }
      expect(buildURL(url, params)).toBe('http://www.baidu.com?a[]=1&a[]=2')
    })
    test('should support date params', () => {
      let url = 'http://www.baidu.com'
      const data = new Date()
      let params = {
        a: data
      }
      expect(buildURL(url, params)).toBe('http://www.baidu.com?a=' + data.toISOString())
    })
    test('should support special char params', () => {
      expect(buildURL('/foo', { foo: '@:$, ' })).toBe('/foo?foo=@:$,+')
    })
    test('should support existing params', () => {
      let url = 'http://www.baidu.com?b=1'
      let params = {
        a: 1
      }
      expect(buildURL(url, params)).toBe('http://www.baidu.com?b=1&a=1')
    })
    test('should correct discard url hash mark', () => {
      let url = 'http://www.baidu.com#index'
      let params = {
        a: 1
      }
      expect(buildURL(url, params)).toBe('http://www.baidu.com?a=1')
    })
    test('should use serialize if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      let url = 'http://www.baidu.com'
      let params = new URLSearchParams('a=1&b=2')
      expect(buildURL(url, params)).toBe('http://www.baidu.com?a=1&b=2')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect different origin', () => {
      expect(isURLSameOrigin('http://www.baidu.com')).toBeFalsy()
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('http://www.baidu.com/index')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://www.baidu.com/index')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://www.baidu.com/')).toBeTruthy()
    })
    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://www.baidu.com/index')).toBeFalsy()
      expect(isAbsoluteURL('!valid://www.baidu.com/index')).toBeFalsy()
    })
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//www.baidu.com/index')).toBeTruthy()
    })
    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/index')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('http://baidu.com', '/index')).toBe('http://baidu.com/index')
    })
    test('should remove duplicate slashes', () => {
      expect(combineURL('http://baidu.com/', '//index')).toBe('http://baidu.com/index')
    })
    test('should insert missing slash', () => {
      expect(combineURL('http://baidu.com', 'index')).toBe('http://baidu.com/index')
    })
    test('should not insert missing slash when relative url missing/empty', () => {
      expect(combineURL('http://baidu.com/index', '')).toBe('http://baidu.com/index')
    })
    test('should allow a single slash for relative url', () => {
      expect(combineURL('http://baidu.com/index', '/')).toBe('http://baidu.com/index/')
    })
  })
})
