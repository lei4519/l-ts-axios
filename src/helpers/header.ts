import { deepMerge, isPlainObject } from './utils'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normallizeName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normallizeName && name.toLowerCase() === normallizeName.toLowerCase()) {
      headers[normallizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data) && headers && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return headers
}

export function parseHeaders(headers: string): object {
  const parsed = Object.create(null)
  if (!headers) return parsed
  const split = /(?<key>.+?):\s(?<val>.+)/
  return parsed.split('\r\n').reduce((parsed: object, str: string): object => {
    const { key, val } = split.exec(str)!.groups!
    if (!key) return parsed
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
