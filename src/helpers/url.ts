import { isDate, isDef, isPlainObject } from './utils'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!isDef(params)) return url
  const serializedParams = Object.entries(params)
    .reduce((parts: any[], item: any): any[] => {
      let [key, val] = item
      if (!isDef(val)) return parts
      if (Array.isArray(val)) {
        key += '[]'
      } else {
        val = [val]
      }
      val.forEach((v: any) => {
        if (isDate(v)) {
          v = v.toISOString()
        }
        if (isPlainObject(v)) {
          v = JSON.stringify(v)
        }
        return parts.push(`${encode(key)}=${encode(v)}`)
      })
      return parts
    }, [])
    .join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex > -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}
