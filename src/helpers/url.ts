import { isDate, isDef, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

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

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!isDef(params)) return url
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    serializedParams = Object.entries(params)
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
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex > -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}

export function isAbsoluteURL (url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL (baseURL: string, relativeURL: string): string {
  return relativeURL
    ? baseURL.replace(/\/+$/, '/') + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function isURLSameOrigin(requestURL: string): boolean {
  const {protocol, host} = resolveURL(requestURL)
  return protocol === curProtocol && host === curHost
}
const urlParsingNode = document.createElement('a')
const { protocol: curProtocol, host: curHost} = window.location

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const {protocol, host} = urlParsingNode
  return { protocol, host }
}