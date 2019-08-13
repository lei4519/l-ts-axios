interface IsType<T> {
  (val: any): val is T
}

function isType<T>(type: string): IsType<T> {
  return (val: any): val is T => Object.prototype.toString.call(val) === `[object ${type}]`
}

export const isObject = (val: any): val is Object => typeof val === 'object' && val !== null

export const isPlainObject = isType<Object>('Object')

export const isDate = isType<Date>('Date')

export const isDef = (val: any): boolean => val !== void 0 && val !== null

export function extend<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
