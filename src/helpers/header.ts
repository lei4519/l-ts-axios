import { deepMerge, isPlainObject } from './utils'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normallizeName: string): void {
  Object.keys(headers).forEach(name => {
    if (name !== normallizeName && name.toLowerCase() === normallizeName.toLowerCase()) {
      headers[normallizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  if (!isPlainObject(headers)) return headers
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data) && headers && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  if ((typeof data === 'string' || data === false) && headers && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return headers
}

export function parseHeaders(headers: string): object {
  const parsed = Object.create(null)
  if (!headers) return parsed
  const split = /(?<key>.+?):\s(?<val>.+)/
  return headers.split('\n').reduce((parsed: object, str: string): object => {
    str = str.trim()
    if (!str) return parsed
    const { key, val } = split.exec(str)!.groups!
    // @ts-ignore
    parsed[key.toLowerCase().trim()] = val.trim()
    return parsed
  }, parsed)
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDel = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDel.forEach(key => {
    delete headers[key]
  })
  return headers
}
