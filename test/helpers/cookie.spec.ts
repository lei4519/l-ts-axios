import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'a=2'
    document.cookie = 'b=3'
    expect(cookie.read('a')).toBe('2')
    expect(cookie.read('b')).toBe('3')
  })
  test('should return null is cookie name is not exist', () => {
    document.cookie = 'a=2;b=3'
    expect(cookie.read('c')).toBeNull()
  })
})
