import {
  isObject,
  isPlainObject,
  isDate,
  isDef,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/utils'

describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Object', () => {
      expect(isObject({})).toBeTruthy()
      expect(isObject([])).toBeTruthy()
      expect(
        isObject(function() {
          /**/
        })
      ).toBeFalsy()
      expect(isObject(1)).toBeFalsy()
      expect(isObject('2')).toBeFalsy()
    })
    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject([])).toBeFalsy()
      expect(
        isPlainObject(function() {
          /**/
        })
      ).toBeFalsy()
      expect(isPlainObject(1)).toBeFalsy()
      expect(isPlainObject('2')).toBeFalsy()
    })
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })
    test('should validate Def', () => {
      let a
      expect(isDef({})).toBeTruthy()
      expect(isDef(0)).toBeTruthy()
      expect(isDef(a)).toBeFalsy()
    })
    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData('a=b&c=1')).toBeFalsy()
    })
    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams('a=b&c=1'))).toBeTruthy()
      expect(isURLSearchParams('a=b&c=1')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      expect(a.foo).toBe(123)
    })
    test('should be not mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      b.foo = 456
      expect(a.foo).toBe(123)
    })
    test('should extend properties', () => {
      const a = { foo: 456, bar: 789 }
      const b = { foo: 123 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })
    test('should deepMerge properties', () => {
      const a: any = { foo: 123 }
      const b: any = { foo: 789 }
      const c: any = { bar: 456 }
      const d = deepMerge(a, b, c)
      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })
    test('should deepMerge recursively', () => {
      const a: any = { foo: 123 }
      const b: any = { foo: 789, bar: { qux: [7, { a: 1 }] } }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: 789,
        bar: {
          qux: [7, { a: 1 }]
        }
      })
    })
    test('should remove all references nested objects', () => {
      const a: any = { foo: { bar: 123 } }
      const b: any = { foo: { a: 1 } }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123,
          a: 1
        }
      })
      expect(c.foo).not.toBe(a.foo)
    })
    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).not.toBe({})
      expect(deepMerge(undefined, { foo: 123 })).not.toBe({ foo: 123 })
    })
  })
})
